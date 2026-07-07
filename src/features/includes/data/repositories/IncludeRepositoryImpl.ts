import { includesDatasource }        from '../datasources/includesDatasource'
import { IncludeMapper }             from '../mappers/include.mapper'
import type { CreateIncludeRequest } from '../../domain/dtos/request/create-include.request'
import type { UpdateIncludeRequest } from '../../domain/dtos/request/update-include.request'
import type { Include }              from '../../domain/models/Include'
import type { IncludeRepository }    from '../../domain/repositories/IncludeRepository'

export class IncludeRepositoryImpl implements IncludeRepository {
  async getByProduct(productId: number): Promise<Include[]> {
    return IncludeMapper.toModelList(await includesDatasource.getByProduct(productId))
  }
  async create(productId: number, data: CreateIncludeRequest): Promise<Include> {
    return IncludeMapper.toModel(await includesDatasource.create(productId, data))
  }
  async update(productId: number, includeId: number, data: UpdateIncludeRequest): Promise<Include> {
    return IncludeMapper.toModel(await includesDatasource.update(productId, includeId, data))
  }
  delete(productId: number, includeId: number): Promise<void> {
    return includesDatasource.delete(productId, includeId)
  }
}