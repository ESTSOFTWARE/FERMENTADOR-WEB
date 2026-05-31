import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BillingRepositoryImpl } from '../../data/repositories/BillingRepositoryImpl'
import { CreateCheckoutUseCase } from '../../domain/usecases/create-checkout.usecase'
import { useUserAuth } from '../../../../core/hooks/userAuth'

const repository      = new BillingRepositoryImpl()
const createCheckout  = new CreateCheckoutUseCase(repository)

export const usePlanesViewModel = () => {
  const { user }   = useUserAuth()
  const navigate   = useNavigate()

  const [billingCycle,    setBillingCycle]    = useState<'monthly' | 'annual'>('monthly')
  const [loadingPlan,     setLoadingPlan]     = useState<string | null>(null)

  // Stripe state
  const [clientSecret,    setClientSecret]    = useState<string | null>(null)
  const [checkoutOpen,    setCheckoutOpen]    = useState(false)

  // PayPal state
  const [paypalModalOpen, setPaypalModalOpen] = useState(false)
  const [paypalPlan,      setPaypalPlan]      = useState<string>('')

  // Payment method picker state
  const [methodModalOpen, setMethodModalOpen] = useState(false)
  const [pendingPlan,     setPendingPlan]     = useState<string>('')

  const handleSelectPlan = (plan: string) => {
    if (!user) {
      navigate('/login', { state: { from: '/planes' } })
      return
    }
    setPendingPlan(plan)
    setMethodModalOpen(true)
  }

  const handleSelectStripe = async () => {
    setMethodModalOpen(false)
    setLoadingPlan(pendingPlan)
    try {
      const secret = await createCheckout.execute(pendingPlan, billingCycle)
      setClientSecret(secret)
      setCheckoutOpen(true)
    } catch (err) {
      console.error('[Billing] Error al crear checkout Stripe:', err)
    } finally {
      setLoadingPlan(null)
    }
  }

  const handleSelectPayPal = () => {
    setMethodModalOpen(false)
    setPaypalPlan(pendingPlan)
    setPaypalModalOpen(true)
  }

  const handlePayPalSuccess = (subscriptionId: string) => {
    console.info('[PayPal] Suscripción aprobada:', subscriptionId)
    setPaypalModalOpen(false)
    navigate('/billing/success?provider=paypal')
  }

  const handlePayPalError = (err: Error) => {
    if (err.message === 'No autorizado' || err.message.startsWith('HTTP 401')) {
      setPaypalModalOpen(false)
      navigate('/login', { state: { from: '/planes' } })
    }
  }

  const closeCheckout = () => {
    setCheckoutOpen(false)
    setClientSecret(null)
  }

  const closeMethodModal = () => {
    setMethodModalOpen(false)
    setPendingPlan('')
  }

  return {
    user,
    billingCycle,
    setBillingCycle,
    loadingPlan,
    handleSelectPlan,
    // Stripe
    clientSecret,
    checkoutOpen,
    closeCheckout,
    // Payment method picker
    methodModalOpen,
    closeMethodModal,
    handleSelectStripe,
    handleSelectPayPal,
    // PayPal
    paypalModalOpen,
    setPaypalModalOpen,
    paypalPlan,
    billingCyclePaypal: billingCycle,
    handlePayPalSuccess,
    handlePayPalError,
  }
}
