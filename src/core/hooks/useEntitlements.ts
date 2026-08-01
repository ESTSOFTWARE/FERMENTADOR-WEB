import { useEffect, useState } from 'react'
import { apiClient } from '../network/client'

export interface Entitlements {
  plan:         string        // free | starter | academic | enterprise
  features:     string[]      // ['sensors', 'start_fermentation', 'reports', ...]
  max_circuits: number | null // null = ilimitado
}

const FREE: Entitlements = { plan: 'free', features: ['sensors', 'start_fermentation'], max_circuits: 1 }

// Cache a nivel de módulo: se consulta una sola vez por sesión.
let cached: Entitlements | null = null

/**
 * Devuelve el plan y las features habilitadas del usuario para gatear la UI.
 * `hasFeature('reports')` → true/false. Mientras carga, asume free (oculta de más,
 * nunca de menos: si el plan sí lo permite, aparece al cargar).
 */
export const useEntitlements = () => {
  const [ent, setEnt] = useState<Entitlements>(cached ?? FREE)
  // loading = todavía no sabemos el plan real (evita bloquear features de un
  // plan pagado antes de que responda /entitlements).
  const [loading, setLoading] = useState<boolean>(cached === null)

  useEffect(() => {
    if (cached) return  // loading ya inició en false (cached === null)
    apiClient.get<Entitlements>('/billing/entitlements')
      .then(e => { cached = e; setEnt(e) })
      .catch(() => { /* sin datos: se queda como free */ })
      .finally(() => setLoading(false))
  }, [])

  return {
    plan:       ent.plan,
    features:   ent.features,
    maxCircuits: ent.max_circuits,
    loading,
    hasFeature: (f: string) => ent.features.includes(f),
  }
}

/** Para invalidar el cache tras pagar/cancelar un plan. */
export const resetEntitlements = () => { cached = null }
