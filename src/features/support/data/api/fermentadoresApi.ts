import { apiClient }            from '../../../../core/network/client'
import type { Fermentador, FermentadorEstado } from '../../domain/models/Fermentador'

export interface UpdateFermentadorBody {
  vendido?:    boolean
  estado?:     FermentadorEstado
  cliente_id?: number | null
}

export const fermentadoresApi = {
  getAll: () => apiClient.get<Fermentador[]>('/fermentadores/'),
  create: () => apiClient.post<Fermentador>('/fermentadores/', {}),
  update: (id: number, body: UpdateFermentadorBody) =>
    apiClient.patch<Fermentador>(`/fermentadores/${id}`, body),
}
