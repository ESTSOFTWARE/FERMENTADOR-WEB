import type { Notificacion } from '../types/notificacion.types'

export const MOCK_NOTIFICACIONES: Notificacion[] = [
  { id: '1',  tipo: 'ticket',      titulo: 'Nuevo chat de soporte',           descripcion: 'Carlos Méndez abrió un nuevo chat sobre calibración de sensores.',         leida: false, creadoEn: '2024-01-20T09:05:00Z' },
  { id: '2',  tipo: 'fermentador', titulo: 'Fermentador sin conexión',         descripcion: 'FRM-00004 lleva más de 24 horas sin reportar datos.',                       leida: false, creadoEn: '2024-01-20T08:30:00Z' },
  { id: '3',  tipo: 'usuario',     titulo: 'Nuevo registro de usuario',        descripcion: 'Ana Torres se registró en la plataforma y está esperando activación.',      leida: false, creadoEn: '2024-01-20T07:45:00Z' },
  { id: '4',  tipo: 'ticket',      titulo: 'Chat sin respuesta (48 h)',        descripcion: 'El chat de Finca El Roble lleva 2 días sin respuesta del equipo.',           leida: true,  creadoEn: '2024-01-19T16:00:00Z' },
  { id: '5',  tipo: 'sistema',     titulo: 'Actualización disponible',         descripcion: 'Firmware v2.3.1 disponible para los módulos IoT del lote 2024-01.',          leida: true,  creadoEn: '2024-01-19T10:00:00Z' },
  { id: '6',  tipo: 'fermentador', titulo: 'Temperatura fuera de rango',       descripcion: 'FRM-00002 reportó temperatura de 38°C, por encima del límite configurado.',  leida: true,  creadoEn: '2024-01-18T22:15:00Z' },
  { id: '7',  tipo: 'usuario',     titulo: 'Código de activación usado',       descripcion: 'El código ACT-9C3B fue usado por Ana Torres para activar su cuenta.',       leida: true,  creadoEn: '2024-01-18T14:30:00Z' },
  { id: '8',  tipo: 'sistema',     titulo: 'Respaldo completado',              descripcion: 'El respaldo automático de la base de datos se completó correctamente.',      leida: true,  creadoEn: '2024-01-17T03:00:00Z' },
  { id: '9',  tipo: 'ticket',      titulo: 'Chat escalado a soporte',          descripcion: 'Sofía Ramírez solicitó escalación tras 3 respuestas sin solución.',          leida: false, creadoEn: '2024-01-20T10:10:00Z' },
  { id: '10', tipo: 'fermentador', titulo: 'pH fuera de rango',                descripcion: 'FRM-00007 reportó pH de 5.1, fuera del rango óptimo de fermentación.',       leida: false, creadoEn: '2024-01-20T06:00:00Z' },
  { id: '11', tipo: 'sistema',     titulo: 'Límite de usuarios alcanzado',     descripcion: 'La instancia actual alcanzó el límite de 50 usuarios activos.',              leida: true,  creadoEn: '2024-01-17T11:00:00Z' },
  { id: '12', tipo: 'usuario',     titulo: 'Cuenta suspendida',                descripcion: 'La cuenta de Roberto Jiménez fue suspendida por inactividad prolongada.',    leida: true,  creadoEn: '2024-01-16T09:30:00Z' },
  { id: '13', tipo: 'fermentador', titulo: 'Fermentador dado de alta',         descripcion: 'FRM-00015 fue registrado en el sistema por Melissa Corral.',                 leida: true,  creadoEn: '2024-01-16T08:00:00Z' },
  { id: '14', tipo: 'sistema',     titulo: 'Integración IoT desconectada',     descripcion: 'El broker MQTT perdió conexión con 3 dispositivos del lote 2024-Q1.',        leida: false, creadoEn: '2024-01-20T05:30:00Z' },
  { id: '15', tipo: 'ticket',      titulo: 'Chat cerrado por inactividad',     descripcion: 'El chat de Emilio Castillo fue cerrado automáticamente tras 7 días.',        leida: true,  creadoEn: '2024-01-15T12:00:00Z' },
]
