import { useCallback, useEffect, useState } from 'react'
import { sileo }                            from 'sileo'
import { SpecificationRepositoryImpl }      from '../../data/repositories/SpecificationRepositoryImpl'
import { GetSpecificationsUseCase }         from '../../domain/usecases/get-specifications.usecase'
import { CreateSpecificationUseCase }       from '../../domain/usecases/create-specification.usecase'
import { UpdateSpecificationUseCase }       from '../../domain/usecases/update-specification.usecase'
import { DeleteSpecificationUseCase }       from '../../domain/usecases/delete-specification.usecase'
import type { Specification }               from '../../domain/models/Specification'
import type { CreateSpecificationRequest }  from '../../domain/dtos/request/create-specification.request'
import type { UpdateSpecificationRequest }  from '../../domain/dtos/request/update-specification.request'
import { TOAST_STYLE }                      from '../../../components/presentation/constants/toast-style.constants'

const repo         = new SpecificationRepositoryImpl()
const getSpecs      = new GetSpecificationsUseCase(repo)
const createSpec    = new CreateSpecificationUseCase(repo)
const updateSpec     = new UpdateSpecificationUseCase(repo)
const deleteSpec     = new DeleteSpecificationUseCase(repo)

export const useSpecificationsViewModel = (productId: number) => {
  const [specs,   setSpecs]   = useState<Specification[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setSpecs(await getSpecs.execute(productId))
    } catch (e) {
      setError((e as Error).message)
      sileo.error({ title: 'Error al cargar especificaciones', description: (e as Error).message, ...TOAST_STYLE })
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => { load() }, [load])

  const create = useCallback(async (data: CreateSpecificationRequest) => {
    try {
      const created = await createSpec.execute(productId, data)
      setSpecs(prev => [...prev, created])
      sileo.success({ title: 'Especificación creada', description: `"${created.name}" agregada.`, ...TOAST_STYLE })
    } catch (e) {
      sileo.error({ title: 'No se pudo crear', description: (e as Error).message, ...TOAST_STYLE })
    }
  }, [productId])

  const update = useCallback(async (specId: number, data: UpdateSpecificationRequest) => {
    try {
      const updated = await updateSpec.execute(productId, specId, data)
      setSpecs(prev => prev.map(s => s.id === updated.id ? updated : s))
      sileo.success({ title: 'Especificación actualizada', ...TOAST_STYLE })
    } catch (e) {
      sileo.error({ title: 'No se pudo actualizar', description: (e as Error).message, ...TOAST_STYLE })
    }
  }, [productId])

  const remove = useCallback(async (specId: number) => {
    try {
      await deleteSpec.execute(productId, specId)
      setSpecs(prev => prev.filter(s => s.id !== specId))
      sileo.success({ title: 'Especificación eliminada', ...TOAST_STYLE })
    } catch (e) {
      sileo.error({ title: 'No se pudo eliminar', description: (e as Error).message, ...TOAST_STYLE })
    }
  }, [productId])

  return { specs, loading, error, create, update, remove, reload: load }
}