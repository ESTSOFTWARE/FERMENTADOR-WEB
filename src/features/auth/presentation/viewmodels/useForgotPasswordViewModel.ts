import { useState } from 'react'
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl'
import { ForgotPasswordUseCase } from '../../domain/usecases/forgot-password.usecase'
import { ResetPasswordUseCase } from '../../domain/usecases/reset-password.usecase'
import type { Step } from '../types/forgot-password.types'

const repo = new AuthRepositoryImpl()

export function useForgotPasswordViewModel() {
  const [step, setStep]         = useState<Step>('email')
  const [email, setEmail]       = useState('')
  const [code, setCode]         = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await new ForgotPasswordUseCase(repo).execute(email)
      setStep('code')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el código.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    if (password.length < 8)  { setError('La contraseña debe tener al menos 8 caracteres.'); return }
    setLoading(true)
    try {
      await new ResetPasswordUseCase(repo).execute(email, code, password)
      setStep('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Código inválido o expirado.')
    } finally {
      setLoading(false)
    }
  }

  return {
    step, email, setEmail,
    code, setCode,
    password, setPassword,
    confirm, setConfirm,
    loading, error,
    handleSendCode, handleReset,
    goToEmail: () => { setStep('email'); setError('') },
  }
}
