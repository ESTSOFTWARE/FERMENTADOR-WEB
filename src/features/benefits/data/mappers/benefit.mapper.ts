import type { BenefitDto } from '../dtos/response/benefit.dto'
import type { Benefit }    from '../../domain/models/Benefit'

export const BenefitMapper = {
  toModel(dto: BenefitDto): Benefit {
    return { id: dto.id, product_id: dto.product_id, title: dto.title, description: dto.description, created_at: dto.created_at }
  },
  toModelList(dtos: BenefitDto[]): Benefit[] {
    return dtos.map(BenefitMapper.toModel)
  },
}