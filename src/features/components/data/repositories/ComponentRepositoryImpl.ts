import { componentsApi }               from '../api/componentsApi'
import type { CreateComponentRequest } from '../../domain/dtos/request/create-component.request'
import type { UpdateComponentRequest } from '../../domain/dtos/request/update-component.request'
import type { Component }              from '../../domain/models/Component'
import type { ComponentRepository }    from '../../domain/repositories/ComponentRepository'

export class ComponentRepositoryImpl implements ComponentRepository {
  getAll():                                          Promise<Component[]> { return componentsApi.getAll() }
  create(data: CreateComponentRequest):              Promise<Component>   { return componentsApi.create(data) }
  update(id: number, data: UpdateComponentRequest):  Promise<Component>   { return componentsApi.update(id, data) }
  delete(id: number):                                Promise<void>        { return componentsApi.delete(id) }
}
