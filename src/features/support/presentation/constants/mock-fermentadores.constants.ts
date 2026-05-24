import type { Fermentador } from '../types/fermentador.types'

export const MOCK_FERMENTADORES: Fermentador[] = [
  { id: '1',  serial: 'FRM-00001', codigoStatus: 'activo-asignado', codigo: 'ACT-4F2A', vendido: true,  clienteNombre: 'Carlos Méndez',   creadoEn: '2024-01-10T09:15:00Z', altaPor: 'Ameth Toledo'     },
  { id: '2',  serial: 'FRM-00002', codigoStatus: 'activo-asignado', codigo: 'ACT-9C3B', vendido: true,  clienteNombre: 'Ana Torres',       creadoEn: '2024-01-12T14:30:00Z', altaPor: 'Fabricio Pérez'   },
  { id: '3',  serial: 'FRM-00003', codigoStatus: 'activo-libre',    codigo: 'ACT-7E1D', vendido: false, clienteNombre: null,               creadoEn: '2024-01-14T11:00:00Z', altaPor: 'Melissa Corral'   },
  { id: '4',  serial: 'FRM-00004', codigoStatus: 'inactivo',        codigo: '—',        vendido: false, clienteNombre: null,               creadoEn: '2024-01-15T08:45:00Z', altaPor: 'Fernando Mijanos' },
  { id: '5',  serial: 'FRM-00005', codigoStatus: 'activo-asignado', codigo: 'ACT-2B8F', vendido: true,  clienteNombre: 'Coop. Yucatán',   creadoEn: '2024-01-16T10:20:00Z', altaPor: 'Ameth Toledo'     },
  { id: '6',  serial: 'FRM-00006', codigoStatus: 'activo-libre',    codigo: 'ACT-5A9C', vendido: false, clienteNombre: null,               creadoEn: '2024-01-17T13:10:00Z', altaPor: 'Fabricio Pérez'   },
  { id: '7',  serial: 'FRM-00007', codigoStatus: 'activo-asignado', codigo: 'ACT-3D6E', vendido: true,  clienteNombre: 'Finca El Roble',  creadoEn: '2024-01-18T09:00:00Z', altaPor: 'Melissa Corral'   },
  { id: '8',  serial: 'FRM-00008', codigoStatus: 'inactivo',        codigo: '—',        vendido: false, clienteNombre: null,               creadoEn: '2024-01-19T16:55:00Z', altaPor: 'Fernando Mijanos' },
  { id: '9',  serial: 'FRM-00009', codigoStatus: 'activo-asignado', codigo: 'ACT-8H5K', vendido: true,  clienteNombre: 'Hacienda Virgen', creadoEn: '2024-01-20T10:00:00Z', altaPor: 'Ameth Toledo'     },
  { id: '10', serial: 'FRM-00010', codigoStatus: 'activo-libre',    codigo: 'ACT-1J9M', vendido: false, clienteNombre: null,               creadoEn: '2024-01-21T11:30:00Z', altaPor: 'Fabricio Pérez'   },
  { id: '11', serial: 'FRM-00011', codigoStatus: 'inactivo',        codigo: '—',        vendido: false, clienteNombre: null,               creadoEn: '2024-01-22T08:00:00Z', altaPor: 'Melissa Corral'   },
  { id: '12', serial: 'FRM-00012', codigoStatus: 'activo-asignado', codigo: 'ACT-6N2P', vendido: true,  clienteNombre: 'Lab Ferment MX',  creadoEn: '2024-01-23T14:00:00Z', altaPor: 'Fernando Mijanos' },
  { id: '13', serial: 'FRM-00013', codigoStatus: 'activo-libre',    codigo: 'ACT-0Q4R', vendido: false, clienteNombre: null,               creadoEn: '2024-01-24T09:45:00Z', altaPor: 'Ameth Toledo'     },
  { id: '14', serial: 'FRM-00014', codigoStatus: 'activo-asignado', codigo: 'ACT-3S7T', vendido: true,  clienteNombre: 'Café Selecto',    creadoEn: '2024-01-25T12:20:00Z', altaPor: 'Fabricio Pérez'   },
  { id: '15', serial: 'FRM-00015', codigoStatus: 'inactivo',        codigo: '—',        vendido: false, clienteNombre: null,               creadoEn: '2024-01-26T15:10:00Z', altaPor: 'Melissa Corral'   },
]
