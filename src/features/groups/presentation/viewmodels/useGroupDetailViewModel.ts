import { useCallback, useEffect, useMemo, useState } from 'react'
import { sileo } from 'sileo'
import { GroupsRepositoryImpl } from '../../data/repositories/GroupsRepositoryImpl'
import type { Group } from '../../domain/models/Group'

const repo = new GroupsRepositoryImpl()
const TOAST_STYLE = { fill: '#1A1A1A', styles: { title: 'text-white', description: 'text-white' } }

const BASE_URL = import.meta.env.VITE_API_URL
const authHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
  ...(localStorage.getItem('access_token')
    ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    : {}),
})

export interface SimpleUser {
  id:            number
  name:          string
  last_name:     string
  email:         string
  profile_image: string | null
}

export const useGroupDetailViewModel = (id: number) => {
  const [group,         setGroup]         = useState<Group | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [showAddMember, setShowAddMember] = useState(false)
  const [showQr,        setShowQr]        = useState(false)
  const [saving,        setSaving]        = useState(false)

  const [allUsers,      setAllUsers]      = useState<SimpleUser[]>([])
  const [loadingUsers,  setLoadingUsers]  = useState(false)
  const [userSearch,    setUserSearch]    = useState('')
  const [selectedUser,  setSelectedUser]  = useState<SimpleUser | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const fetched = await repo.getById(id)
      setGroup(fetched)
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
      const res  = await fetch(`${BASE_URL}/users/students`, { headers: authHeaders() })
      const data = await res.json()
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
