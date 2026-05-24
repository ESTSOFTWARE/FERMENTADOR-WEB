import type { GroupsRepository } from '../repositories/GroupsRepository'
import type { Group }            from '../models/Group'

export class GetAllGroupsAdminUseCase {
  private readonly repository: GroupsRepository

  constructor(repository: GroupsRepository) {
    this.repository = repository
  }

  execute(): Promise<Group[]> {
    return this.repository.getAllAdmin()
  }
}
