import { useState, useEffect }  from 'react'
import { UserRepositoryImpl }   from '../../data/repositories/UserRepositoryImpl'
import { useUserAuth }             from '../../../../core/hooks/userAuth'
import type { User, Role }      from '../../models/entities/User'
import type { EditUserForm }    from '../types/edit-user-form.types'

const repo = new UserRepositoryImpl()

export const useManageUsersViewModel = () => {
  const { user } = useUserAuth()
  const isProfesor = (user?.role ?? '') === 'profesor'

  const [users,      setUsers]      = useState<User[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [search,     setSearch]     = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [editing,    setEditing]    = useState<number | null>(null)
  const [editForm,   setEditForm]   = useState<EditUserForm | null>(null)
  const [deleteId,   setDeleteId]   = useState<number | null>(null)
  const [success,    setSuccess]    = useState<string | null>(null)
  const [saving,     setSaving]     = useState(false)
  const [deleting,   setDeleting]   = useState(false)

  useEffect(() => {
    repo.getAll()
      .then(setUsers)
      .catch(() => setError('Error al cargar usuarios.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const matchSearch = (
      u.name.toLowerCase().includes(q)      ||
      u.last_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)     ||
      u.role_name?.toLowerCase().includes(q)
    )
    // Profesor solo ve estudiantes
    const matchRole = isProfesor
      ? u.role_name === 'Estudiante'
      : roleFilter === '' || u.role_name === roleFilter
    return matchSearch && matchRole
  })

  const flash = (msg: string) => {
    setSuccess(msg)
    setTimeout(() => setSuccess(null), 3000)
  }

  const startEdit = (u: User) => {
    setEditing(u.id)
    setEditForm({
      name:       u.name,
      last_name:  u.last_name,
      email:      u.email,
      role_name:  (u.role_name ?? 'Estudiante') as Role,
      circuit_id: u.circuit_id !== null ? String(u.circuit_id) : '',
    })
  }

  const cancelEdit = () => { setEditing(null); setEditForm(null) }

  const saveEdit = async () => {
    if (!editForm || editing === null) return
    setSaving(true)
    try {
      const updated = await repo.update(editing, {
        name:      editForm.name,
        last_name: editForm.last_name,
        email:     editForm.email,
        role:      editForm.role_name.toLowerCase(),
      })
      setUsers(prev => prev.map(u =>
        u.id === editing ? { ...u, ...updated, role_name: updated.role_name ?? u.role_name } : u
      ))
      setEditing(null)
      setEditForm(null)
      flash('Usuario actualizado correctamente.')
    } catch {
      setError('Error al actualizar usuario.')
    } finally {
      setSaving(false)
    }
  }

  const confirmDelete = async () => {
    if (deleteId === null) return
    setDeleting(true)
    try {
      await repo.delete(deleteId)
      setUsers(prev => prev.filter(u => u.id !== deleteId))
      setDeleteId(null)
      flash('Usuario eliminado.')
    } catch {
      setError('Error al eliminar usuario.')
    } finally {
      setDeleting(false)
    }
  }

  const setField = (key: keyof EditUserForm, value: string) =>
    setEditForm(prev => prev ? { ...prev, [key]: value } : prev)

  return {
    users, filtered, loading, error,
    search, setSearch,
    roleFilter, setRoleFilter,
    editing, editForm, setField,
    startEdit, cancelEdit, saveEdit, saving,
    deleteId, setDeleteId, confirmDelete, deleting,
    success,
    isProfesor,
  }
}