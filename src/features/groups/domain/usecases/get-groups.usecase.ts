import type { GroupsRepository } from '../repositories/GroupsRepository'
import type { Group }            from '../models/Group'

export class GetGroupsUseCase {
  private readonly repository: GroupsRepository

  constructor(repository: GroupsRepository) {
    this.repository = repository
  }

  execute(): Promise<Group[]> {
    return this.repository.getAll()
  }
}
