import type { Component }           from '../../domain/models/Component'
import type { ComponentFormState }  from '../types/component-form.types'

export const initialState = (editing: Component | null): ComponentFormState => ({
  name:        editing?.name ?? '',
  sku:         editing?.sku ?? '',
  price:       editing != null ? String(editing.price) : '',
  stock:       editing != null ? String(editing.stock) : '0',
  description: editing?.description ?? '',
  category_id: editing?.category_id != null ? String(editing.category_id) : '',
})
