import { useCallback, useEffect, useState } from 'react'
import { GroupsRepositoryImpl }             from '../../data/repositories/GroupsRepositoryImpl'
import type { Group }                       from '../../domain/models/Group'

const repo = new GroupsRepositoryImpl()

export const useAdminGroupsViewModel = () => {
  const [groups,  setGroups]  = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setGroups(await repo.getAllAdmin())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())    ||
    g.subject.toLowerCase().includes(search.toLowerCase()) ||
    g.code.toLowerCase().includes(search.toLowerCase())
  )

  return { loading, search, setSearch, filtered }
}
