import { useCallback, useEffect, useState } from 'react'
import { sileo } from 'sileo'
import { GroupsRepositoryImpl } from '../../data/repositories/GroupsRepositoryImpl'
import type { Group } from '../../domain/models/Group'

const repo = new GroupsRepositoryImpl()
const TOAST_STYLE = { fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } }

export const useGroupsViewModel = () => {
  const [groups,  setGroups]  = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  const [showCreate,   setShowCreate]   = useState(false)
  const [createName,   setCreateName]   = useState('')
  const [createSubject, setCreateSubject] = useState('')
  const [coverFile,    setCoverFile]    = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [saving,       setSaving]       = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setGroups(await repo.getAll())
    } catch (e) {
      sileo.error({ title: 'Error al cargar grupos', description: (e as Error).message, ...TOAST_STYLE })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const pickCover = (file: File) => {
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const resetCreate = () => {
    setCreateName('')
    setCreateSubject('')
    setCoverFile(null)
    setCoverPreview(null)
  }

  const createGroup = async () => {
    if (!createName.trim() || !createSubject.trim()) return
    try {
      setSaving(true)
      let group = await repo.create({ name: createName.trim(), subject: createSubject.trim() })
      if (coverFile) group = await repo.uploadCover(group.id, coverFile)
      setGroups(prev => [group, ...prev])
      resetCreate()
      setShowCreate(false)
      sileo.success({ title: 'Grupo creado', description: `"${group.name}" listo para añadir alumnos.`, ...TOAST_STYLE })
    } catch (e) {
      sileo.error({ title: 'No se pudo crear el grupo', description: (e as Error).message, ...TOAST_STYLE })
    } finally {
      setSaving(false)
    }
  }

  const deleteGroup = async (id: number) => {
    try {
      const name = groups.find(g => g.id === id)?.name ?? 'Grupo'
      await repo.delete(id)
      setGroups(prev => prev.filter(g => g.id !== id))
      sileo.success({ title: 'Grupo eliminado', description: `"${name}" fue eliminado.`, ...TOAST_STYLE })
    } catch (e) {
      sileo.error({ title: 'No se pudo eliminar', description: (e as Error).message, ...TOAST_STYLE })
    }
  }

  return {
    groups, loading,
    showCreate, setShowCreate,
    createName, setCreateName,
    createSubject, setCreateSubject,
    coverPreview, pickCover,
    saving,
    createGroup, deleteGroup,
    resetCreate,
  }
}
