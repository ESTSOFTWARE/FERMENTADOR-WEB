import type { Component }              from '../../domain/models/Component'
import type { CreateComponentRequest } from '../../domain/dtos/request/create-component.request'

export interface ComponentFormModalProps {
  open:    boolean
  editing: Component | null
  saving:  boolean
  onClose: () => void
  onSave:  (data: CreateComponentRequest) => void
}

export interface ComponentFormState {
  name: string; sku: string; price: string; stock: string; description: string; category_id: string
}
