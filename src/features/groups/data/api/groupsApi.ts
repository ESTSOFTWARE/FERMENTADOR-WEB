import type { CreateGroupRequest } from '../../domain/dtos/request/create-group.request'
import type { AddMemberRequest }   from '../../domain/dtos/request/add-member.request'
import type { Group }              from '../../domain/models/Group'
import type { SimpleUser }         from '../../domain/models/SimpleUser'
import { apiClient }               from '../../../../core/network/client'

export const groupsApi = {
  getAll:      ()           => apiClient.get<Group[]>('/groups/'),
  getAllAdmin:  ()           => apiClient.get<Group[]>('/groups/all'),
  getById:     (id: number) => apiClient.get<Group>(`/groups/${id}`),

  create: (data: CreateGroupRequest) =>
    apiClient.post<Group>('/groups/', data),

  delete: (id: number) =>
    apiClient.delete<void>(`/groups/${id}`),

  addMember: (groupId: number, data: AddMemberRequest) =>
    apiClient.post<Group>(`/groups/${groupId}/members`, data),

  removeMember: (groupId: number, studentId: number) =>
    apiClient.delete<void>(`/groups/${groupId}/members/${studentId}`),

  uploadCover: (groupId: number, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient.upload<Group>(`/groups/${groupId}/cover`, form)
  },

  getStudents: () =>
    apiClient.get<SimpleUser[]>('/users/students'),
}
