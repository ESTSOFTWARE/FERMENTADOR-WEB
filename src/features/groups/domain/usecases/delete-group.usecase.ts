import type { GroupsRepository } from '../repositories/GroupsRepository'

export class DeleteGroupUseCase {
  private readonly repository: GroupsRepository

  constructor(repository: GroupsRepository) {
    this.repository = repository
  }

  execute(id: number): Promise<void> {
    return this.repository.delete(id)
  }
}
