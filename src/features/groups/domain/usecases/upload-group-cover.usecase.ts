import type { GroupsRepository } from '../repositories/GroupsRepository'
import type { Group }            from '../models/Group'

export class UploadGroupCoverUseCase {
  private readonly repository: GroupsRepository

  constructor(repository: GroupsRepository) {
    this.repository = repository
  }

  execute(groupId: number, file: File): Promise<Group> {
    return this.repository.uploadCover(groupId, file)
  }
}
