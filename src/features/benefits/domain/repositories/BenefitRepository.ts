import type { Benefit }              from '../models/Benefit'
import type { CreateBenefitRequest } from '../dtos/request/create-benefit.request'
import type { UpdateBenefitRequest } from '../dtos/request/update-benefit.request'

export interface BenefitRepository {
  getByProduct(productId: number):                                       Promise<Benefit[]>
  create(productId: number, data: CreateBenefitRequest):                 Promise<Benefit>
  update(productId: number, benefitId: number, data: UpdateBenefitRequest): Promise<Benefit>
  delete(productId: number, benefitId: number):                          Promise<void>
}