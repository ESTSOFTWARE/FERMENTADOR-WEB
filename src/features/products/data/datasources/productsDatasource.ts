import type { ProductDto, ProductsResponseDto } from '../dtos/response/product.dto'
import { apiClient } from '../../../../core/network/client'

export const productsDatasource = {
  getAll:  ()           => apiClient.get<ProductsResponseDto>('/products/?limit=100'),
  getById: (id: number) => apiClient.get<ProductDto>(`/products/${id}`),
}