import type { GroupsRepository }    from '../repositories/GroupsRepository'
import type { CreateGroupRequest }  from '../dtos/request/create-group.request'
import type { Group }               from '../models/Group'

export class CreateGroupUseCase {
  private readonly repository: GroupsRepository

  constructor(repository: GroupsRepository) {
    this.repository = repository
  }

  execute(data: CreateGroupRequest): Promise<Group> {
    return this.repository.create(data)
  }
}
