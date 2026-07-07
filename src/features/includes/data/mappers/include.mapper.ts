import type { IncludeDto } from '../dtos/response/include.dto'
import type { Include }    from '../../domain/models/Include'

export const IncludeMapper = {
  toModel(dto: IncludeDto): Include {
    return { id: dto.id, product_id: dto.product_id, description: dto.description, created_at: dto.created_at }
  },
  toModelList(dtos: IncludeDto[]): Include[] {
    return dtos.map(IncludeMapper.toModel)
  },
}