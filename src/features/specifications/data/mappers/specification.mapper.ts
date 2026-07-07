import type { SpecificationDto } from '../dtos/response/specification.dto'
import type { Specification }    from '../../domain/models/Specification'

export const SpecificationMapper = {
  toModel(dto: SpecificationDto): Specification {
    return {
      id:         dto.id,
      product_id: dto.product_id,
      name:       dto.name,
      value:      dto.value,
      created_at: dto.created_at,
    }
  },
  toModelList(dtos: SpecificationDto[]): Specification[] {
    return dtos.map(SpecificationMapper.toModel)
  },
}