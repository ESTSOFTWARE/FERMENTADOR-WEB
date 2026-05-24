import type { CreateGroupRequest }              from '../../domain/dtos/request/create-group.request'
import type { AddMemberRequest }               from '../../domain/dtos/request/add-member.request'
import type { Group }                          from '../../domain/models/Group'
import type { SimpleUser }                     from '../../domain/models/SimpleUser'
import { authHeaders, authHeadersMultipart, handleResponse } from '../../../../core/api/http'

const BASE_URL = import.meta.env.VITE_API_URL

export const groupsApi = {
  getAll: (): Promise<Group[]> =>
    fetch(`${BASE_URL}/groups/`, { headers: authHeaders() })
      .then(handleResponse<Group[]>),

  getAllAdmin: (): Promise<Group[]> =>
    fetch(`${BASE_URL}/groups/all`, { headers: authHeaders() })
      .then(handleResponse<Group[]>),

  getById: (id: number): Promise<Group> =>
    fetch(`${BASE_URL}/groups/${id}`, { headers: authHeaders() })
      .then(handleResponse<Group>),

  create: (data: CreateGroupRequest): Promise<Group> =>
    fetch(`${BASE_URL}/groups/`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify(data),
    }).then(handleResponse<Group>),

  delete: (id: number): Promise<void> =>
    fetch(`${BASE_URL}/groups/${id}`, {
      method:  'DELETE',
      headers: authHeaders(),
    }).then(handleResponse<void>),

  addMember: (groupId: number, data: AddMemberRequest): Promise<Group> =>
    fetch(`${BASE_URL}/groups/${groupId}/members`, {
      method:  'POST',
      headers: authHeaders(),
      body:    JSON.stringify(data),
    }).then(handleResponse<Group>),

  removeMember: (groupId: number, studentId: number): Promise<void> =>
    fetch(`${BASE_URL}/groups/${groupId}/members/${studentId}`, {
      method:  'DELETE',
      headers: authHeaders(),
    }).then(handleResponse<void>),

  uploadCover: (groupId: number, file: File): Promise<Group> => {
    const form = new FormData()
    form.append('file', file)
    return fetch(`${BASE_URL}/groups/${groupId}/cover`, {
      method:  'POST',
      headers: authHeadersMultipart(),
      body:    form,
    }).then(handleResponse<Group>)
  },

  getStudents: (): Promise<SimpleUser[]> =>
    fetch(`${BASE_URL}/users/students`, { headers: authHeaders() })
      .then(handleResponse<SimpleUser[]>),
}
