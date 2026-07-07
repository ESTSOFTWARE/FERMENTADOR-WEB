import { benefitsDatasource }        from '../datasources/benefitsDatasource'
import { BenefitMapper }             from '../mappers/benefit.mapper'
import type { CreateBenefitRequest } from '../../domain/dtos/request/create-benefit.request'
import type { UpdateBenefitRequest } from '../../domain/dtos/request/update-benefit.request'
import type { Benefit }              from '../../domain/models/Benefit'
import type { BenefitRepository }    from '../../domain/repositories/BenefitRepository'

export class BenefitRepositoryImpl implements BenefitRepository {
  async getByProduct(productId: number): Promise<Benefit[]> {
    return BenefitMapper.toModelList(await benefitsDatasource.getByProduct(productId))
  }
  async create(productId: number, data: CreateBenefitRequest): Promise<Benefit> {
    return BenefitMapper.toModel(await benefitsDatasource.create(productId, data))
  }
  async update(productId: number, benefitId: number, data: UpdateBenefitRequest): Promise<Benefit> {
    return BenefitMapper.toModel(await benefitsDatasource.update(productId, benefitId, data))
  }
  delete(productId: number, benefitId: number): Promise<void> {
    return benefitsDatasource.delete(productId, benefitId)
  }
}