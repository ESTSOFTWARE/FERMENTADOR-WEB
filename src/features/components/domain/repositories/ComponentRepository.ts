import type { CreateComponentRequest } from '../dtos/request/create-component.request'
import type { UpdateComponentRequest } from '../dtos/request/update-component.request'
import type { Component }              from '../models/Component'

export interface ComponentRepository {
  getAll():                                            Promise<Component[]>
  create(data: CreateComponentRequest):                Promise<Component>
  update(id: number, data: UpdateComponentRequest):    Promise<Component>
  delete(id: number):                                  Promise<void>
}
