import { useCallback, useEffect, useState } from 'react'
import { sileo }                            from 'sileo'
import { BenefitRepositoryImpl }            from '../../data/repositories/BenefitRepositoryImpl'
import { GetBenefitsUseCase }               from '../../domain/usecases/get-benefits.usecase'
import { CreateBenefitUseCase }             from '../../domain/usecases/create-benefit.usecase'
import { UpdateBenefitUseCase }             from '../../domain/usecases/update-benefit.usecase'
import { DeleteBenefitUseCase }             from '../../domain/usecases/delete-benefit.usecase'
import type { Benefit }                     from '../../domain/models/Benefit'
import type { CreateBenefitRequest }        from '../../domain/dtos/request/create-benefit.request'
import type { UpdateBenefitRequest }        from '../../domain/dtos/request/update-benefit.request'
import { TOAST_STYLE }                      from '../../../components/presentation/constants/toast-style.constants'

const repo          = new BenefitRepositoryImpl()
const getBenefits    = new GetBenefitsUseCase(repo)
const createBenefit  = new CreateBenefitUseCase(repo)
const updateBenefit  = new UpdateBenefitUseCase(repo)
const deleteBenefit  = new DeleteBenefitUseCase(repo)

export const useBenefitsViewModel = (productId: number) => {
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setBenefits(await getBenefits.execute(productId))
    } catch (e) {
      setError((e as Error).message)
      sileo.error({ title: 'Error al cargar beneficios', description: (e as Error).message, ...TOAST_STYLE })
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => { load() }, [load])

  const create = useCallback(async (data: CreateBenefitRequest) => {
    try {
      const created = await createBenefit.execute(productId, data)
      setBenefits(prev => [...prev, created])
      sileo.success({ title: 'Beneficio agregado', ...TOAST_STYLE })
    } catch (e) {
      sileo.error({ title: 'No se pudo agregar', description: (e as Error).message, ...TOAST_STYLE })
    }
  }, [productId])

  const update = useCallback(async (benefitId: number, data: UpdateBenefitRequest) => {
    try {
      const updated = await updateBenefit.execute(productId, benefitId, data)
      setBenefits(prev => prev.map(b => b.id === updated.id ? updated : b))
      sileo.success({ title: 'Beneficio actualizado', ...TOAST_STYLE })
    } catch (e) {
      sileo.error({ title: 'No se pudo actualizar', description: (e as Error).message, ...TOAST_STYLE })
    }
  }, [productId])

  const remove = useCallback(async (benefitId: number) => {
    try {
      await deleteBenefit.execute(productId, benefitId)
      setBenefits(prev => prev.filter(b => b.id !== benefitId))
      sileo.success({ title: 'Beneficio eliminado', ...TOAST_STYLE })
    } catch (e) {
      sileo.error({ title: 'No se pudo eliminar', description: (e as Error).message, ...TOAST_STYLE })
    }
  }, [productId])

  return { benefits, loading, error, create, update, remove, reload: load }
}