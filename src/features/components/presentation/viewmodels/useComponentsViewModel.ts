import { useCallback, useEffect, useState } from 'react'
import { sileo }                            from 'sileo'
import { ComponentRepositoryImpl }          from '../../data/repositories/ComponentRepositoryImpl'
import { GetComponentsUseCase }             from '../../domain/usecases/get-components.usecase'
import { CreateComponentUseCase }           from '../../domain/usecases/create-component.usecase'
import { UpdateComponentUseCase }           from '../../domain/usecases/update-component.usecase'
import { DeleteComponentUseCase }           from '../../domain/usecases/delete-component.usecase'
import type { Component }                   from '../../domain/models/Component'
import type { CreateComponentRequest }      from '../../domain/dtos/request/create-component.request'
import type { ComponentExtras }             from '../types/component-form.types'
import { specificationsApi }                from '../../data/api/specificationsApi'
import { includesApi }                      from '../../data/api/includesApi'
import { benefitsApi }                      from '../../data/api/benefitsApi'
import { componentsApi }                    from '../../data/api/componentsApi'
import { TOAST_STYLE }                      from '../constants/toast-style.constants'

// Persiste specs/includes/beneficios. En edición reemplaza (borra los viejos y recrea).
async function syncExtras(productId: number, extras: ComponentExtras, isEdit: boolean) {
  if (isEdit) {
    const [oldSpecs, oldIncludes, oldBenefits] = await Promise.all([
      specificationsApi.getAll(productId).catch(() => []),
      includesApi.getAll(productId).catch(() => []),
      benefitsApi.getAll(productId).catch(() => []),
    ])
    await Promise.all([
      ...oldSpecs.map(s => specificationsApi.delete(productId, s.id)),
      ...oldIncludes.map(i => includesApi.delete(productId, i.id)),
      ...oldBenefits.map(b => benefitsApi.delete(productId, b.id)),
    ])
  }
  await Promise.all([
    ...extras.specs
      .filter(s => s.name.trim() && s.value.trim())
      .map(s => specificationsApi.create(productId, { name: s.name.trim(), value: s.value.trim() })),
    ...extras.includes
      .filter(d => d.trim())
      .map(d => includesApi.create(productId, { description: d.trim() })),
    ...extras.benefits
      .filter(b => b.title.trim())
      .map(b => benefitsApi.create(productId, { title: b.title.trim(), description: b.description.trim() || null })),
  ])
}

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

  const handleSave = useCallback(async (data: CreateComponentRequest, extras: ComponentExtras) => {
    try {
      setSaving(true)
      if (editing) {
        let updated = await updateComponent.execute(editing.id, data)
        await syncExtras(updated.id, extras, true)
        if (extras.imageFile) updated = await componentsApi.uploadImage(updated.id, extras.imageFile)
        setComponents(prev => prev.map(c => c.id === updated.id ? updated : c))
        sileo.success({ title: 'Componente actualizado', description: `"${updated.name}" se guardó.`, ...TOAST_STYLE })
      } else {
        let created = await createComponent.execute(data)
        await syncExtras(created.id, extras, false)
        if (extras.imageFile) created = await componentsApi.uploadImage(created.id, extras.imageFile)
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
