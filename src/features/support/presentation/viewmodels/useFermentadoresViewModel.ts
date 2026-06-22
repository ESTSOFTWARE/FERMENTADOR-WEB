import { useEffect, useState } from 'react'
import { fermentadoresApi, type UpdateFermentadorBody } from '../../data/api/fermentadoresApi'
import type { Fermentador } from '../../domain/models/Fermentador'

/**
 * Lista, registra y actualiza fermentadores (GET/POST/PATCH /api/fermentadores)
 * para el panel del dashboard de soporte.
 */
export const useFermentadoresViewModel = () => {
  const [items,   setItems]   = useState<Fermentador[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(false)

  useEffect(() => {
    let active = true
    fermentadoresApi.getAll()
      .then(data => { if (active) setItems(data) })
      .catch(()  => { if (active) setError(true) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  // Registra un fermentador nuevo (serial + código generados por el backend).
  const register = async (): Promise<Fermentador> => {
    const nuevo = await fermentadoresApi.create()
    setItems(prev => [nuevo, ...prev])
    return nuevo
  }

  // Actualiza vendido / estado / cliente de un fermentador.
  const updateField = async (id: number, body: UpdateFermentadorBody): Promise<void> => {
    const updated = await fermentadoresApi.update(id, body)
    setItems(prev => prev.map(f => f.id === id ? updated : f))
  }

  return { items, loading, error, register, updateField }
}
