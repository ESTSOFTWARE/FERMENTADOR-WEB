import { apiClient } from '../../../../core/network/client'

// Respuesta de POST /api/circuits — registra un fermentador (circuito) y
// devuelve su código de activación.
export interface CreatedCircuit {
  id:              number
  activation_code: string
  created_at:      string | null
}

export const circuitsApi = {
  create: () => apiClient.post<CreatedCircuit>('/circuits/', {}),
}
