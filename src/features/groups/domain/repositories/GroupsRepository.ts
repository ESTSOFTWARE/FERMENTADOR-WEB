import type { CreateGroupRequest } from '../dtos/request/create-group.request'
import type { AddMemberRequest }   from '../dtos/request/add-member.request'
import type { Group }              from '../models/Group'
import type { SimpleUser }         from '../models/SimpleUser'

export interface GroupsRepository {
  getAll():                                           Promise<Group[]>
  getAllAdmin():                                       Promise<Group[]>
  getById(id: number):                                Promise<Group>
  create(data: CreateGroupRequest):                   Promise<Group>
  delete(id: number):                                 Promise<void>
  addMember(groupId: number, data: AddMemberRequest): Promise<Group>
  removeMember(groupId: number, studentId: number):   Promise<void>
  uploadCover(groupId: number, file: File):           Promise<Group>
  getStudents():                                      Promise<SimpleUser[]>
}
