import type { GroupsRepository }  from '../repositories/GroupsRepository'
import type { AddMemberRequest }  from '../dtos/request/add-member.request'
import type { Group }             from '../models/Group'

export class AddMemberUseCase {
  private readonly repository: GroupsRepository

  constructor(repository: GroupsRepository) {
    this.repository = repository
  }

  execute(groupId: number, data: AddMemberRequest): Promise<Group> {
    return this.repository.addMember(groupId, data)
  }
}
