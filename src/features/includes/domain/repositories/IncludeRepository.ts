import type { Include }              from '../models/Include'
import type { CreateIncludeRequest } from '../dtos/request/create-include.request'
import type { UpdateIncludeRequest } from '../dtos/request/update-include.request'

export interface IncludeRepository {
  getByProduct(productId: number):                                       Promise<Include[]>
  create(productId: number, data: CreateIncludeRequest):                 Promise<Include>
  update(productId: number, includeId: number, data: UpdateIncludeRequest): Promise<Include>
  delete(productId: number, includeId: number):                          Promise<void>
}