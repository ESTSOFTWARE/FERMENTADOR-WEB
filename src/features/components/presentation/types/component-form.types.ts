import type { Component }              from '../../domain/models/Component'
import type { CreateComponentRequest } from '../../domain/dtos/request/create-component.request'

export interface ComponentExtras {
  specs:     { name: string; value: string }[]
  includes:  string[]
  benefits:  { title: string; description: string }[]
  imageFile: File | null
}

export interface ComponentFormModalProps {
  open:    boolean
  editing: Component | null
  saving:  boolean
  onClose: () => void
  onSave:  (data: CreateComponentRequest, extras: ComponentExtras) => void
}

export interface ComponentFormState {
  name: string; sku: string; price: string; stock: string; description: string; category_id: string
  image: string
}
