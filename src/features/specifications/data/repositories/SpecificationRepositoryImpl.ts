import { specificationsDatasource }        from '../datasources/specificationsDatasource'
import { SpecificationMapper }             from '../mappers/specification.mapper'
import type { CreateSpecificationRequest } from '../../domain/dtos/request/create-specification.request'
import type { UpdateSpecificationRequest } from '../../domain/dtos/request/update-specification.request'
import type { Specification }              from '../../domain/models/Specification'
import type { SpecificationRepository }    from '../../domain/repositories/SpecificationRepository'

export class SpecificationRepositoryImpl implements SpecificationRepository {
  async getByProduct(productId: number): Promise<Specification[]> {
    return SpecificationMapper.toModelList(await specificationsDatasource.getByProduct(productId))
  }
  async create(productId: number, data: CreateSpecificationRequest): Promise<Specification> {
    return SpecificationMapper.toModel(await specificationsDatasource.create(productId, data))
  }
  async update(productId: number, specId: number, data: UpdateSpecificationRequest): Promise<Specification> {
    return SpecificationMapper.toModel(await specificationsDatasource.update(productId, specId, data))
  }
  delete(productId: number, specId: number): Promise<void> {
    return specificationsDatasource.delete(productId, specId)
  }
}