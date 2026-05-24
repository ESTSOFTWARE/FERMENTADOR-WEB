import type { GroupsRepository } from '../repositories/GroupsRepository'
import type { Group }            from '../models/Group'

export class GetGroupByIdUseCase {
  private readonly repository: GroupsRepository

  constructor(repository: GroupsRepository) {
    this.repository = repository
  }

  execute(id: number): Promise<Group> {
    return this.repository.getById(id)
  }
}
