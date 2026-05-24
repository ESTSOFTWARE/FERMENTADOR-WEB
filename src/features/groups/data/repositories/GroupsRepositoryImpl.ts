import { groupsApi }                from '../api/groupsApi'
import type { CreateGroupRequest }  from '../../domain/dtos/request/create-group.request'
import type { AddMemberRequest }    from '../../domain/dtos/request/add-member.request'
import type { Group }               from '../../domain/models/Group'
import type { SimpleUser }          from '../../domain/models/SimpleUser'
import type { GroupsRepository }    from '../../domain/repositories/GroupsRepository'

export class GroupsRepositoryImpl implements GroupsRepository {
  getAll():                                            Promise<Group[]>      { return groupsApi.getAll() }
  getAllAdmin():                                        Promise<Group[]>      { return groupsApi.getAllAdmin() }
  getById(id: number):                                 Promise<Group>        { return groupsApi.getById(id) }
  create(data: CreateGroupRequest):                    Promise<Group>        { return groupsApi.create(data) }
  delete(id: number):                                  Promise<void>         { return groupsApi.delete(id) }
  addMember(groupId: number, data: AddMemberRequest):  Promise<Group>        { return groupsApi.addMember(groupId, data) }
  removeMember(groupId: number, studentId: number):    Promise<void>         { return groupsApi.removeMember(groupId, studentId) }
  uploadCover(groupId: number, file: File):            Promise<Group>        { return groupsApi.uploadCover(groupId, file) }
  getStudents():                                       Promise<SimpleUser[]> { return groupsApi.getStudents() }
}
