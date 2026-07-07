import type { ComponentDto } from '../dtos/response/component.dto'
import type { Component }    from '../../domain/models/Component'

export const ComponentMapper = {
  toModel(dto: ComponentDto): Component {
    return {
      id:          dto.id,
      name:        dto.name,
      description: dto.description,
      price:       dto.price,
      sku:         dto.sku,
      stock:       dto.stock,
      rating:      dto.rating,
      category_id: dto.category_id,
      created_at:  dto.created_at,
      updated_at:  dto.updated_at,
    }
  },
  toModelList(dtos: ComponentDto[]): Component[] {
    return dtos.map(ComponentMapper.toModel)
  },
}