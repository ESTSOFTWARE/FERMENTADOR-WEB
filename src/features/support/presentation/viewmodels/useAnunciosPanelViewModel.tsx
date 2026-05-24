import { useState, useEffect }              from 'react'
import { sileo }                            from 'sileo'
import { AnnouncementsRepositoryImpl }      from '../../../announcements/data/repositories/AnnouncementsRepositoryImpl'
import { GetAnnouncementsUseCase }          from '../../../announcements/domain/usecases/get-announcements.usecase'
import { CreateAnnouncementUseCase }        from '../../../announcements/domain/usecases/create-announcement.usecase'
import { UpdateAnnouncementUseCase }        from '../../../announcements/domain/usecases/update-announcement.usecase'
import { DeleteAnnouncementUseCase }        from '../../../announcements/domain/usecases/delete-announcement.usecase'
import { PinAnnouncementUseCase }           from '../../../announcements/domain/usecases/pin-announcement.usecase'
import { UnpinAnnouncementUseCase }         from '../../../announcements/domain/usecases/unpin-announcement.usecase'
import { EMPTY_ANNOUNCEMENT_FORM }          from '../constants/announcement-label-colors.constants'
import { PAGE_SIZE }                        from '../constants/pagination.constants'
import type { Announcement }               from '../../../announcements/domain/models/Announcement'

const repo      = new AnnouncementsRepositoryImpl()
const getAll    = new GetAnnouncementsUseCase(repo)
const createOne = new CreateAnnouncementUseCase(repo)
const updateOne = new UpdateAnnouncementUseCase(repo)
const deleteOne = new DeleteAnnouncementUseCase(repo)
const pinOne    = new PinAnnouncementUseCase(repo)
const unpinOne  = new UnpinAnnouncementUseCase(repo)

export const useAnunciosPanelViewModel = () => {
  const [items, setItems]           = useState<Announcement[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [showForm, setShowForm]     = useState(false)
  const [form, setForm]             = useState(EMPTY_ANNOUNCEMENT_FORM)
  const [saving, setSaving]         = useState(false)
  const [saveError, setSaveError]   = useState<string | null>(null)
  const [selected, setSelected]     = useState<Announcement | null>(null)
  const [editing, setEditing]       = useState(false)
  const [editForm, setEditForm]     = useState(EMPTY_ANNOUNCEMENT_FORM)
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError]   = useState<string | null>(null)
  const [page, setPage]             = useState(1)
  const [pinning, setPinning]       = useState(false)

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const paged      = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const isPinActive = (item: Announcement) => {
    if (!item.is_pinned) return false
    if (!item.pinned_until) return true
    return new Date(item.pinned_until) > new Date()
  }

  const load = () => {
    setLoading(true); setError(null)
    getAll.execute()
      .then(setItems)
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    if (!form.title.trim() || !form.version.trim() || !form.description.trim()) {
      setSaveError('Título, versión y descripción son obligatorios.'); return
    }
    setSaving(true); setSaveError(null)
    try {
      await createOne.execute({
        label:       form.label,
        version:     form.version.trim(),
        date:        form.date.trim() || undefined,
        title:       form.title.trim(),
        description: form.description.trim(),
      })
      setForm(EMPTY_ANNOUNCEMENT_FORM); setShowForm(false)
      sileo.success({ title: 'Comunicado publicado', description: 'Ya es visible para todos los usuarios.', fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })
      load()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Error al crear el anuncio.')
    } finally {
      setSaving(false)
    }
  }

  const executeDelete = async (id: number) => {
    try {
      await deleteOne.execute(id)
      setItems(prev => prev.filter(i => i.id !== id))
      if (selected?.id === id) setSelected(null)
      sileo.success({ title: 'Comunicado eliminado', fill: '#1A1A1A', styles: { title: 'text-white' } })
    } catch {
      sileo.error({ title: 'Error al eliminar', description: 'Intenta de nuevo.', fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })
    }
  }

  const confirmDelete = (item: Announcement) => {
    const toastId = sileo.action({
      title: 'Eliminar comunicado',
      description: (
        <div className="flex flex-col gap-2">
          <span style={{ color: '#A1A1AA', fontSize: 12 }}>
            ¿Seguro que quieres eliminar "{item.title}"? Esta acción no se puede deshacer.
          </span>
          <button
            onPointerDown={e => { e.stopPropagation(); sileo.dismiss(toastId) }}
            style={{ fontSize: 11, color: '#52525B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            No, mantener comunicado
          </button>
        </div>
      ),
      fill:     '#1A1A1A',
      duration: null,
      styles:   { title: 'text-white' },
      button: {
        title:   'Eliminar',
        onClick: () => { sileo.dismiss(toastId); executeDelete(item.id) },
      },
    })
  }

  const handlePin = async (item: Announcement, durationDays: number | null) => {
    setPinning(true)
    try {
      const updated = await pinOne.execute(item.id, durationDays)
      setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
      setSelected(updated)
      sileo.success({ title: 'Comunicado fijado', description: durationDays ? `Se desfijará en ${durationDays} día${durationDays > 1 ? 's' : ''}.` : 'Fijado indefinidamente.', fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } })
    } catch {
      sileo.error({ title: 'Error al fijar', fill: '#1A1A1A', styles: { title: 'text-white' } })
    } finally {
      setPinning(false)
    }
  }

  const handleUnpin = async (item: Announcement) => {
    setPinning(true)
    try {
      const updated = await unpinOne.execute(item.id)
      setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
      setSelected(updated)
      sileo.success({ title: 'Comunicado desfijado', fill: '#1A1A1A', styles: { title: 'text-white' } })
    } catch {
      sileo.error({ title: 'Error al desfijar', fill: '#1A1A1A', styles: { title: 'text-white' } })
    } finally {
      setPinning(false)
    }
  }

  const openEdit = (item: Announcement) => {
    setEditForm({ label: item.label, version: item.version, date: item.date, title: item.title, description: item.description })
    setEditError(null)
    setEditing(true)
  }

  const handleSaveEdit = async () => {
    if (!editForm.title.trim() || !editForm.version.trim() || !editForm.description.trim()) {
      setEditError('Título, versión y descripción son obligatorios.'); return
    }
    if (!selected) return
    setSavingEdit(true); setEditError(null)
    try {
      const updated = await updateOne.execute(selected.id, {
        label:       editForm.label,
        version:     editForm.version.trim(),
        date:        editForm.date.trim() || undefined,
        title:       editForm.title.trim(),
        description: editForm.description.trim(),
      })
      setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
      setSelected(updated)
      setEditing(false)
      sileo.success({ title: 'Comunicado actualizado', fill: '#1A1A1A', styles: { title: 'text-white' } })
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'Error al actualizar.')
    } finally {
      setSavingEdit(false)
    }
  }

  return {
    items, paged, loading, error,
    showForm, setShowForm,
    form, setForm, saving, saveError, handleCreate,
    selected, setSelected,
    editing, setEditing, editForm, setEditForm, savingEdit, editError,
    page, setPage, totalPages,
    pinning, isPinActive,
    confirmDelete, handlePin, handleUnpin, openEdit, handleSaveEdit,
  }
}
