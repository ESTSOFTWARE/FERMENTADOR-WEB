import { useCallback, useEffect, useMemo, useState } from 'react'
import { sileo }                                     from 'sileo'
import { GroupsRepositoryImpl }                      from '../../data/repositories/GroupsRepositoryImpl'
import type { Group }                                from '../../domain/models/Group'
import type { SimpleUser }                           from '../../domain/models/SimpleUser'
import { TOAST_STYLE }                               from '../constants/toast-style.constants'

const repo = new GroupsRepositoryImpl()

export const useGroupDetailViewModel = (id: number) => {
  const [group,         setGroup]         = useState<Group | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showQr,        setShowQr]        = useState(false)
  const [saving,        setSaving]        = useState(false)

  const [allUsers,     setAllUsers]     = useState<SimpleUser[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [userSearch,   setUserSearch]   = useState('')
  const [selectedUser, setSelectedUser] = useState<SimpleUser | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setGroup(await repo.getById(id))
    } catch (e) {
      sileo.error({ title: 'No se pudo cargar el grupo', description: (e as Error).message, ...TOAST_STYLE })
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const fetchUsers = useCallback(async () => {
    try {
      setLoadingUsers(true)
      const data = await repo.getStudents()
      setAllUsers(Array.isArray(data) ? data : [])
    } catch {
      setAllUsers([])
    } finally {
      setLoadingUsers(false)
    }
  }, [])

  useEffect(() => {
    if (showAddMember && allUsers.length === 0) fetchUsers()
    if (!showAddMember) { setUserSearch(''); setSelectedUser(null) }
  }, [showAddMember, fetchUsers, allUsers.length])

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase()
    if (!q) return []
    return allUsers
      .filter(u =>
        `${u.name} ${u.last_name}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [userSearch, allUsers])

  const addMember = async () => {
    if (!group || !selectedUser) return
    try {
      setSaving(true)
      const updated = await repo.addMember(group.id, { student_id: selectedUser.id })
      setGroup(updated)
      setShowAddMember(false)
      sileo.success({ title: 'Alumno agregado', description: `${selectedUser.name} fue añadido al grupo.`, ...TOAST_STYLE })
    } catch (e) {
      sileo.error({ title: 'No se pudo agregar', description: (e as Error).message, ...TOAST_STYLE })
    } finally {
      setSaving(false)
    }
  }

  const removeMember = async (studentId: number) => {
    if (!group) return
    try {
      await repo.removeMember(group.id, studentId)
      setGroup(prev => prev ? { ...prev, members: prev.members.filter(m => m.student_id !== studentId) } : prev)
      sileo.success({ title: 'Alumno removido', description: 'El alumno fue removido del grupo.', ...TOAST_STYLE })
    } catch (e) {
      sileo.error({ title: 'No se pudo remover', description: (e as Error).message, ...TOAST_STYLE })
    }
  }

  return {
    group, loading,
    showAddMember, setShowAddMember,
    showQr, setShowQr,
    saving,
    addMember, removeMember,
    userSearch, setUserSearch,
    selectedUser, setSelectedUser,
    filteredUsers, loadingUsers,
  }
}
