import type { GroupsRepository } from '../repositories/GroupsRepository'

export class RemoveMemberUseCase {
  private readonly repository: GroupsRepository

  constructor(repository: GroupsRepository) {
    this.repository = repository
  }

  execute(groupId: number, studentId: number): Promise<void> {
    return this.repository.removeMember(groupId, studentId)
  }
}
