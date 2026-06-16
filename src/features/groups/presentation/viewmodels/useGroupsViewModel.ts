import { useCallback, useEffect, useState } from 'react'
import { sileo }                            from 'sileo'
import { GroupsRepositoryImpl }             from '../../data/repositories/GroupsRepositoryImpl'
import { GetGroupsUseCase }                 from '../../domain/usecases/get-groups.usecase'
import { CreateGroupUseCase }               from '../../domain/usecases/create-group.usecase'
import { DeleteGroupUseCase }               from '../../domain/usecases/delete-group.usecase'
import { UploadGroupCoverUseCase }          from '../../domain/usecases/upload-group-cover.usecase'
import type { Group }                       from '../../domain/models/Group'
import { TOAST_STYLE }                      from '../constants/toast-style.constants'

const repo        = new GroupsRepositoryImpl()
const getGroups   = new GetGroupsUseCase(repo)
const createGroup = new CreateGroupUseCase(repo)
const deleteGroup = new DeleteGroupUseCase(repo)
const uploadCover = new UploadGroupCoverUseCase(repo)

export const useGroupsViewModel = () => {
  const [groups,  setGroups]  = useState<Group[]>([])
  const [loading, setLoading] = useState(true)

  const [showCreate,    setShowCreate]    = useState(false)
  const [createName,    setCreateName]    = useState('')
  const [createSubject, setCreateSubject] = useState('')
  const [coverFile,     setCoverFile]     = useState<File | null>(null)
  const [coverPreview,  setCoverPreview]  = useState<string | null>(null)
  const [saving,        setSaving]        = useState(false)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setGroups(await getGroups.execute())
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

  const handleCreateGroup = async () => {
    if (!createName.trim() || !createSubject.trim()) return
    try {
      setSaving(true)
      // 1) Crear el grupo (esto es lo crítico)
      let group = await createGroup.execute({ name: createName.trim(), subject: createSubject.trim() })

      // 2) Subir la portada es opcional: si falla, el grupo igual queda creado
      let coverFailed = false
      if (coverFile) {
        try {
          group = await uploadCover.execute(group.id, coverFile)
        } catch {
          coverFailed = true
        }
      }

      setGroups(prev => [group, ...prev])
      resetCreate()
      setShowCreate(false)

      if (coverFailed) {
        sileo.success({ title: 'Grupo creado', description: `"${group.name}" se creó, pero no se pudo subir la portada.`, ...TOAST_STYLE })
      } else {
        sileo.success({ title: 'Grupo creado', description: `"${group.name}" listo para añadir alumnos.`, ...TOAST_STYLE })
      }
    } catch (e) {
      sileo.error({ title: 'No se pudo crear el grupo', description: (e as Error).message, ...TOAST_STYLE })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteGroup = async (id: number) => {
    try {
      const name = groups.find(g => g.id === id)?.name ?? 'Grupo'
      await deleteGroup.execute(id)
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
    createGroup: handleCreateGroup,
    deleteGroup: handleDeleteGroup,
    resetCreate,
  }
}
