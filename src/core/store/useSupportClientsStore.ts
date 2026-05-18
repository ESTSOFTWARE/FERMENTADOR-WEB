import { create } from 'zustand'

export type ClientStatus = 'active' | 'suspended'
export type CodeStatus   = 'used' | 'none'

export interface SupportClient {
  id: string
  name: string
  last_name: string
  email: string
  role: string
  status: ClientStatus
  activationCode: string | null
  codeStatus: CodeStatus
  createdAt: string
}

export interface ActivationCode {
  id: string
  code: string
  assignedTo: string | null
  assignedEmail: string | null
  status: 'available' | 'used'
  createdAt: string
}

const genCode = () => {
  const seg = () => Math.random().toString(36).toUpperCase().slice(2, 6)
  return `NK-${seg()}-${seg()}`
}

const MOCK_CLIENTS: SupportClient[] = [
  { id: '1',  name: 'Carlos',    last_name: 'Méndez',    email: 'carlos@cafetero.mx',    role: 'estudiante', status: 'active',    activationCode: 'NK-7HJ2-9KM4', codeStatus: 'used', createdAt: '2025-03-15T10:00:00.000Z' },
  { id: '2',  name: 'María',     last_name: 'López',     email: 'maria@finca.com',        role: 'profesor',   status: 'active',    activationCode: 'NK-2PQ8-5RX1', codeStatus: 'used', createdAt: '2025-04-02T14:30:00.000Z' },
  { id: '3',  name: 'Roberto',   last_name: 'Jiménez',   email: 'roberto@coop.org',       role: 'estudiante', status: 'suspended', activationCode: null,            codeStatus: 'none', createdAt: '2025-04-20T09:15:00.000Z' },
  { id: '4',  name: 'Ana',       last_name: 'García',    email: 'ana@cafegourmet.mx',     role: 'estudiante', status: 'active',    activationCode: null,            codeStatus: 'none', createdAt: '2025-05-01T11:45:00.000Z' },
  { id: '5',  name: 'Sofía',     last_name: 'Ramírez',   email: 'sofia@coop.com',         role: 'estudiante', status: 'active',    activationCode: 'NK-4QR7-2WE9', codeStatus: 'used', createdAt: '2025-05-03T08:20:00.000Z' },
  { id: '6',  name: 'Jorge',     last_name: 'Villanueva',email: 'jorge@hacienda.mx',      role: 'profesor',   status: 'active',    activationCode: 'NK-8ZX1-6TY3', codeStatus: 'used', createdAt: '2025-05-04T09:00:00.000Z' },
  { id: '7',  name: 'Valentina', last_name: 'Cruz',      email: 'vcruz@fermenta.org',     role: 'estudiante', status: 'suspended', activationCode: null,            codeStatus: 'none', createdAt: '2025-05-05T10:10:00.000Z' },
  { id: '8',  name: 'Diego',     last_name: 'Salazar',   email: 'diego@cafetalen.mx',     role: 'estudiante', status: 'active',    activationCode: 'NK-3LM5-1NP8', codeStatus: 'used', createdAt: '2025-05-06T11:00:00.000Z' },
  { id: '9',  name: 'Gabriela',  last_name: 'Moreno',    email: 'gmoreno@finca.com',      role: 'profesor',   status: 'active',    activationCode: null,            codeStatus: 'none', createdAt: '2025-05-07T12:30:00.000Z' },
  { id: '10', name: 'Andrés',    last_name: 'Fuentes',   email: 'afuentes@coop.mx',       role: 'estudiante', status: 'active',    activationCode: 'NK-9AB2-7CD4', codeStatus: 'used', createdAt: '2025-05-08T08:45:00.000Z' },
  { id: '11', name: 'Lucía',     last_name: 'Espinoza',  email: 'lucia@labcafe.mx',       role: 'estudiante', status: 'suspended', activationCode: null,            codeStatus: 'none', createdAt: '2025-05-09T09:15:00.000Z' },
  { id: '12', name: 'Héctor',    last_name: 'Paredes',   email: 'hparedes@cafetos.mx',    role: 'estudiante', status: 'active',    activationCode: 'NK-5EF6-3GH0', codeStatus: 'used', createdAt: '2025-05-10T10:00:00.000Z' },
  { id: '13', name: 'Natalia',   last_name: 'Vega',      email: 'nvega@fincapura.com',    role: 'profesor',   status: 'active',    activationCode: null,            codeStatus: 'none', createdAt: '2025-05-11T11:20:00.000Z' },
  { id: '14', name: 'Emilio',    last_name: 'Castillo',  email: 'ecastillo@coop.org',     role: 'estudiante', status: 'active',    activationCode: 'NK-1IJ7-4KL2', codeStatus: 'used', createdAt: '2025-05-12T13:00:00.000Z' },
  { id: '15', name: 'Fernanda',  last_name: 'Olvera',    email: 'folvera@cafemaya.mx',    role: 'estudiante', status: 'suspended', activationCode: null,            codeStatus: 'none', createdAt: '2025-05-13T14:30:00.000Z' },
]

interface SupportClientsStore {
  clients: SupportClient[]
  codes: ActivationCode[]
  generateCode: (clientId: string) => string
  toggleStatus: (clientId: string) => void
}

export const useSupportClientsStore = create<SupportClientsStore>((set, get) => ({
  clients: MOCK_CLIENTS,
  codes: [],

  generateCode: (clientId) => {
    const existing = get().clients.find(c => c.id === clientId)
    if (existing?.codeStatus === 'used') return existing.activationCode!

    const code = genCode()
    const now  = new Date().toISOString()
    const client = existing

    set(s => ({
      codes: [
        {
          id: crypto.randomUUID(),
          code,
          assignedTo: clientId,
          assignedEmail: client?.email ?? null,
          status: 'used',
          createdAt: now,
        },
        ...s.codes,
      ],
      clients: s.clients.map(c =>
        c.id === clientId
          ? { ...c, activationCode: code, codeStatus: 'used' }
          : c
      ),
    }))

    return code
  },

  toggleStatus: (clientId) => {
    set(s => ({
      clients: s.clients.map(c =>
        c.id === clientId
          ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' }
          : c
      ),
    }))
  },
}))
