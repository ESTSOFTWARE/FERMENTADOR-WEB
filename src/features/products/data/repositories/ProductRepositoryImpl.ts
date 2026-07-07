import { productsDatasource }     from '../datasources/productsDatasource'
import { ProductMapper }          from '../mappers/product.mapper'
import type { Product }           from '../../domain/models/Product'
import type { ProductRepository } from '../../domain/repositories/ProductRepository'

export class ProductRepositoryImpl implements ProductRepository {
  async getAll(): Promise<Product[]> {
    const response = await productsDatasource.getAll()
    return ProductMapper.toModelList(response.items)
  }

  async getById(id: number): Promise<Product> {
    return ProductMapper.toModel(await productsDatasource.getById(id))
  }
}