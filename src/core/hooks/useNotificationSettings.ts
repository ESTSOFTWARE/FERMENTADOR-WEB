import { useState } from 'react'

export interface NotifSettings {
  alertas:     boolean
  reportes:    boolean
  usuarios:    boolean
  comunicados: boolean
  sonido:      boolean
}

export type NotifCategory = 'alertas' | 'reportes' | 'usuarios' | 'comunicados'

const DEFAULT: NotifSettings = {
  alertas: true, reportes: true, usuarios: true, comunicados: true, sonido: false,
}

const STORAGE_KEY = 'notif_settings'

/** Lee los settings de localStorage (con defaults). Seguro fuera de React. */
export const loadNotifSettings = (): NotifSettings => {
  try {
    return { ...DEFAULT, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }
  } catch {
    return DEFAULT
  }
}

/** Mapea el `type` del backend a la categoría del switch. null = siempre se muestra. */
export const categoryOf = (type: string): NotifCategory | null => {
  switch (type) {
    case 'high_temperature':
    case 'sensor_failure':
      return 'alertas'
    case 'fermentation_complete':
    case 'fermentation_interrupted':
    case 'experiment_complete':
      return 'reportes'
    case 'member_added':
    case 'member_removed':
    case 'user_registered':
      return 'usuarios'
    case 'new_announcement':
      return 'comunicados'
    default:
      return null // 'general' u otros → no se filtran
  }
}

/** ¿Debe mostrarse/sonar una notificación de este tipo según los settings? */
export const isTypeEnabled = (type: string, s: NotifSettings): boolean => {
  const cat = categoryOf(type)
  return !cat || s[cat]
}

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotifSettings>(loadNotifSettings)

  const toggle = (key: keyof NotifSettings) =>
    setSettings(prev => {
      const next = { ...prev, [key]: !prev[key] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })

  return { settings, toggle }
}
