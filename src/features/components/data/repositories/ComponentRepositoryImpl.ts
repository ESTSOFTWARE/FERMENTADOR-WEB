import { componentsDatasource }        from '../datasources/componentsDatasource'
import { ComponentMapper }             from '../mappers/component.mapper'
import type { CreateComponentRequest } from '../../domain/dtos/request/create-component.request'
import type { UpdateComponentRequest } from '../../domain/dtos/request/update-component.request'
import type { Component }              from '../../domain/models/Component'
import type { ComponentRepository }    from '../../domain/repositories/ComponentRepository'

export class ComponentRepositoryImpl implements ComponentRepository {
  async getAll(): Promise<Component[]> {
    const response = await componentsDatasource.getAll()
    return ComponentMapper.toModelList(response.items)
  }
  async create(data: CreateComponentRequest): Promise<Component> {
    return ComponentMapper.toModel(await componentsDatasource.create(data))
  }
  async update(id: number, data: UpdateComponentRequest): Promise<Component> {
    return ComponentMapper.toModel(await componentsDatasource.update(id, data))
  }
  delete(id: number): Promise<void> {
    return componentsDatasource.delete(id)
  }
}