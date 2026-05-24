import type { GroupsRepository } from '../repositories/GroupsRepository'
import type { SimpleUser }       from '../models/SimpleUser'

export class GetStudentsUseCase {
  private readonly repository: GroupsRepository

  constructor(repository: GroupsRepository) {
    this.repository = repository
  }

  execute(): Promise<SimpleUser[]> {
    return this.repository.getStudents()
  }
}
