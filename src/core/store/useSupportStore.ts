import { create } from 'zustand'

export type TicketStatus = 'pending' | 'answered'

export interface TicketMessage {
  from: 'bot' | 'user' | 'agent'
  text: string
  createdAt: string
}

export interface SupportTicket {
  id: string
  name: string
  email: string
  message: string
  messages: TicketMessage[]
  status: TicketStatus
  createdAt: string
}

interface SupportStore {
  tickets: SupportTicket[]
  addTicket: (data: { name: string; email: string; message: string }) => void
  addReply: (ticketId: string, text: string) => void
  markAnswered: (ticketId: string) => void
}

const ago = (minutes: number) => new Date(Date.now() - minutes * 60 * 1000).toISOString()

const mock = (name: string, email: string, message: string, status: TicketStatus, minutesAgo: number): SupportTicket => {
  const now = ago(minutesAgo)
  return {
    id: crypto.randomUUID(),
    name, email, message, status,
    createdAt: now,
    messages: [
      { from: 'bot',  text: '¡Hola! 👋 ¿Cuál es tu nombre?',                                        createdAt: now },
      { from: 'user', text: name,                                                                     createdAt: now },
      { from: 'bot',  text: `Hola, ${name}! ¿Cuál es tu correo electrónico para poder responderte?`, createdAt: now },
      { from: 'user', text: email,                                                                    createdAt: now },
      { from: 'bot',  text: 'Perfecto. ¿En qué podemos ayudarte?',                                   createdAt: now },
      { from: 'user', text: message,                                                                  createdAt: now },
      { from: 'bot',  text: `¡Gracias! Recibimos tu mensaje y nos pondremos en contacto contigo en ${email} pronto. 🙌`, createdAt: now },
    ],
  }
}

const MOCK_TICKETS: SupportTicket[] = [
  mock('Luis Hernández',   'luis@cafetero.mx',     'No puedo iniciar sesión, me dice que las credenciales son incorrectas.',    'pending',  4),
  mock('Ana García',       'ana@finca.com',         'Al subir el reporte de fermentación me aparece un error 500.',              'pending',  17),
  mock('Roberto Jiménez',  'roberto@coop.org',      '¿Cómo configuro los umbrales de pH en los sensores?',                      'pending',  45),
  mock('María López',      'maria@cafegourmet.mx',  'El código de activación que me dieron no funciona.',                       'answered', 120),
  mock('Carlos Méndez',    'carlos@finca.mx',       'No veo la sección de gráficas en mi cuenta de estudiante.',                'answered', 300),
  mock('Sofía Ramírez',    'sofia@coop.com',        'La app se cierra sola al intentar ver los datos históricos.',               'pending',  90),
  mock('Jorge Villanueva', 'jorge@hacienda.mx',     'El sensor de temperatura no aparece en el dashboard.',                     'answered', 480),
  mock('Valentina Cruz',   'vcruz@fermenta.org',    '¿Cómo exporto los reportes en PDF?',                                       'pending',  200),
  mock('Diego Salazar',    'diego@cafetalen.mx',    'Tengo problemas para conectar el fermentador al WiFi.',                    'answered', 600),
  mock('Gabriela Moreno',  'gmoreno@finca.com',     'El gráfico de pH no actualiza en tiempo real.',                            'pending',  35),
  mock('Andrés Fuentes',   'afuentes@coop.mx',      'Olvidé mi contraseña y el correo de recuperación no llega.',               'pending',  10),
  mock('Lucía Espinoza',   'lucia@labcafe.mx',      '¿Es posible tener más de un fermentador en la misma cuenta?',              'answered', 720),
  mock('Héctor Paredes',   'hparedes@cafetos.mx',   'No entiendo cómo interpretar los datos de densidad.',                      'pending',  55),
  mock('Natalia Vega',     'nvega@fincapura.com',   'El sistema me marca error al intentar cambiar el nombre del fermentador.', 'answered', 980),
  mock('Emilio Castillo',  'ecastillo@coop.org',    '¿Cuándo estará disponible la app móvil?',                                  'pending',  15),
]

export const useSupportStore = create<SupportStore>((set) => ({
  tickets: MOCK_TICKETS,

  addTicket: ({ name, email, message }) => {
    const now = new Date().toISOString()
    const ticket: SupportTicket = {
      id: crypto.randomUUID(),
      name,
      email,
      message,
      status: 'pending',
      createdAt: now,
      messages: [
        { from: 'bot',   text: '¡Hola! 👋 ¿Cuál es tu nombre?',                                         createdAt: now },
        { from: 'user',  text: name,                                                                      createdAt: now },
        { from: 'bot',   text: `Hola, ${name}! ¿Cuál es tu correo electrónico para poder responderte?`, createdAt: now },
        { from: 'user',  text: email,                                                                     createdAt: now },
        { from: 'bot',   text: 'Perfecto. ¿En qué podemos ayudarte?',                                    createdAt: now },
        { from: 'user',  text: message,                                                                   createdAt: now },
        { from: 'bot',   text: `¡Gracias! Recibimos tu mensaje y nos pondremos en contacto contigo en ${email} pronto. 🙌`, createdAt: now },
      ],
    }
    set(s => ({ tickets: [ticket, ...s.tickets] }))
  },

  addReply: (ticketId, text) => {
    const now = new Date().toISOString()
    set(s => ({
      tickets: s.tickets.map(t =>
        t.id === ticketId
          ? { ...t, status: 'answered', messages: [...t.messages, { from: 'agent', text, createdAt: now }] }
          : t
      ),
    }))
  },

  markAnswered: (ticketId) => {
    set(s => ({
      tickets: s.tickets.map(t => t.id === ticketId ? { ...t, status: 'answered' } : t),
    }))
  },
}))
