import type { ProductDto } from '../dtos/response/product.dto'
import type { Product }    from '../../domain/models/Product'

export const ProductMapper = {
  // Solo mapea los campos que el backend realmente entrega.
  // image, tags, category, specs, inclusions, compatibility, reviews,
  // reviewCount y ratingDistribution se enriquecen aparte (ver ViewModel de detalle).
  toModel(dto: ProductDto): Product {
    return {
      id:          dto.id,
      name:        dto.name,
      description: dto.description,
      price:       dto.price,
      sku:         dto.sku,
      stock:       dto.stock,
      rating:      dto.rating,
    }
  },
  toModelList(dtos: ProductDto[]): Product[] {
    return dtos.map(ProductMapper.toModel)
  },
}