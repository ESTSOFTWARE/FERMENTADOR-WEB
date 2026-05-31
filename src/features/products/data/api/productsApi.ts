import type { Product } from '../../domain/models/Product'
import { apiClient }    from '../../../../core/network/client'

export const productsApi = {
  getAll:    ():              Promise<Product[]> => apiClient.get<Product[]>('/products'),
  getById:   (id: number):   Promise<Product>   => apiClient.get<Product>(`/products/${id}`),
}
