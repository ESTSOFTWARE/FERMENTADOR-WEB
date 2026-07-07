import { useCallback, useEffect, useState } from 'react'
import { sileo }                            from 'sileo'
import { IncludeRepositoryImpl }            from '../../data/repositories/IncludeRepositoryImpl'
import { GetIncludesUseCase }               from '../../domain/usecases/get-includes.usecase'
import { CreateIncludeUseCase }             from '../../domain/usecases/create-include.usecase'
import { UpdateIncludeUseCase }             from '../../domain/usecases/update-include.usecase'
import { DeleteIncludeUseCase }             from '../../domain/usecases/delete-include.usecase'
import type { Include }                     from '../../domain/models/Include'
import type { CreateIncludeRequest }        from '../../domain/dtos/request/create-include.request'
import type { UpdateIncludeRequest }        from '../../domain/dtos/request/update-include.request'
import { TOAST_STYLE }                      from '../../../components/presentation/constants/toast-style.constants'

const repo          = new IncludeRepositoryImpl()
const getIncludes    = new GetIncludesUseCase(repo)
const createInclude  = new CreateIncludeUseCase(repo)
const updateInclude  = new UpdateIncludeUseCase(repo)
const deleteInclude  = new DeleteIncludeUseCase(repo)

export const useIncludesViewModel = (productId: number) => {
  const [includes, setIncludes] = useState<Include[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setIncludes(await getIncludes.execute(productId))
    } catch (e) {
      setError((e as Error).message)
      sileo.error({ title: 'Error al cargar elementos incluidos', description: (e as Error).message, ...TOAST_STYLE })
    } finally {
      setLoading(false)
    }
  }, [productId])

  useEffect(() => { load() }, [load])

  const create = useCallback(async (data: CreateIncludeRequest) => {
    try {
      const created = await createInclude.execute(productId, data)
      setIncludes(prev => [...prev, created])
      sileo.success({ title: 'Elemento agregado', ...TOAST_STYLE })
    } catch (e) {
      sileo.error({ title: 'No se pudo agregar', description: (e as Error).message, ...TOAST_STYLE })
    }
  }, [productId])

  const update = useCallback(async (includeId: number, data: UpdateIncludeRequest) => {
    try {
      const updated = await updateInclude.execute(productId, includeId, data)
      setIncludes(prev => prev.map(i => i.id === updated.id ? updated : i))
      sileo.success({ title: 'Elemento actualizado', ...TOAST_STYLE })
    } catch (e) {
      sileo.error({ title: 'No se pudo actualizar', description: (e as Error).message, ...TOAST_STYLE })
    }
  }, [productId])

  const remove = useCallback(async (includeId: number) => {
    try {
      await deleteInclude.execute(productId, includeId)
      setIncludes(prev => prev.filter(i => i.id !== includeId))
      sileo.success({ title: 'Elemento eliminado', ...TOAST_STYLE })
    } catch (e) {
      sileo.error({ title: 'No se pudo eliminar', description: (e as Error).message, ...TOAST_STYLE })
    }
  }, [productId])

  return { includes, loading, error, create, update, remove, reload: load }
}