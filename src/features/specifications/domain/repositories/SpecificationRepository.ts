import type { Specification }               from '../models/Specification'
import type { CreateSpecificationRequest }  from '../dtos/request/create-specification.request'
import type { UpdateSpecificationRequest }  from '../dtos/request/update-specification.request'

export interface SpecificationRepository {
  getByProduct(productId: number):                                          Promise<Specification[]>
  create(productId: number, data: CreateSpecificationRequest):               Promise<Specification>
  update(productId: number, specId: number, data: UpdateSpecificationRequest): Promise<Specification>
  delete(productId: number, specId: number):                                 Promise<void>
}