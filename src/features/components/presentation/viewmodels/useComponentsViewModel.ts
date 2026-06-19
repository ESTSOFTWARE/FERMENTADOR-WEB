import { useCallback, useEffect, useState } from 'react'
import { sileo }                            from 'sileo'
import { ComponentRepositoryImpl }          from '../../data/repositories/ComponentRepositoryImpl'
import { GetComponentsUseCase }             from '../../domain/usecases/get-components.usecase'
import { CreateComponentUseCase }           from '../../domain/usecases/create-component.usecase'
import { UpdateComponentUseCase }           from '../../domain/usecases/update-component.usecase'
import { DeleteComponentUseCase }           from '../../domain/usecases/delete-component.usecase'
import type { Component }                   from '../../domain/models/Component'
import type { CreateComponentRequest }      from '../../domain/dtos/request/create-component.request'
import { TOAST_STYLE }                      from '../constants/toast-style.constants'

const repo            = new ComponentRepositoryImpl()
const getComponents   = new GetComponentsUseCase(repo)
const createComponent = new CreateComponentUseCase(repo)
const updateComponent = new UpdateComponentUseCase(repo)
const deleteComponent = new DeleteComponentUseCase(repo)

export const useComponentsViewModel = () => {
  const [components, setComponents] = useState<Component[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [search,     setSearch]     = useState('')

  // Modal de crear / editar
  const [showForm,   setShowForm]   = useState(false)
  const [editing,    setEditing]    = useState<Component | null>(null)
  const [saving,     setSaving]     = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setComponents(await getComponents.execute())
    } catch (e) {
      setError((e as Error).message)
      sileo.error({ title: 'Error al cargar componentes', description: (e as Error).message, ...TOAST_STYLE })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = components.filter(c => {
    const q = search.toLowerCase()
    return c.name.toLowerCase().includes(q) ||
      c.sku.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
  })

  const openCreate = () => { setEditing(null);  setShowForm(true) }
  const openEdit   = (c: Component) => { setEditing(c); setShowForm(true) }
  const closeForm  = () => { setShowForm(false); setEditing(null) }

  const handleSave = useCallback(async (data: CreateComponentRequest) => {
    try {
      setSaving(true)
      if (editing) {
        const updated = await updateComponent.execute(editing.id, data)
        setComponents(prev => prev.map(c => c.id === updated.id ? updated : c))
        sileo.success({ title: 'Componente actualizado', description: `"${updated.name}" se guardó.`, ...TOAST_STYLE })
      } else {
        const created = await createComponent.execute(data)
        setComponents(prev => [created, ...prev])
        sileo.success({ title: 'Componente creado', description: `"${created.name}" agregado al catálogo.`, ...TOAST_STYLE })
      }
      closeForm()
    } catch (e) {
      sileo.error({ title: 'No se pudo guardar', description: (e as Error).message, ...TOAST_STYLE })
    } finally {
      setSaving(false)
    }
  }, [editing])

  const handleDelete = useCallback(async (c: Component) => {
    try {
      await deleteComponent.execute(c.id)
      setComponents(prev => prev.filter(x => x.id !== c.id))
      sileo.success({ title: 'Componente eliminado', description: `"${c.name}" fue eliminado.`, ...TOAST_STYLE })
    } catch (e) {
      sileo.error({ title: 'No se pudo eliminar', description: (e as Error).message, ...TOAST_STYLE })
    }
  }, [])

  return {
    components: filtered,
    total: components.length,
    loading, error,
    search, setSearch,
    showForm, editing, saving,
    openCreate, openEdit, closeForm,
    saveComponent:   handleSave,
    deleteComponent: handleDelete,
  }
}
