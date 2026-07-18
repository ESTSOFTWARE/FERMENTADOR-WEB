export const nav = [
  {
    label: 'Inicio',
    path: '/overview',
    group: null,
    allowedRoles: ['admin', 'profesor', 'estudiante'],
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    description: 'Página principal'
  },
  {
    label: 'Nuevo Experimento',
    path: '/dashboard',
    group: 'Experimentar con IA',
    allowedRoles: ['admin', 'profesor'],
    groupIcon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0m-9-5a4 4 0 100 8 4 4 0 000-8z',
    groupDescription: 'Configurar y analizar',
    icon: 'M12 4v16m8-8H4',
    description: 'Configurar parámetros'
  },
  {
    label: 'Resultados',
    path: '/results/:id',
    group: 'Experimentar con IA',
    allowedRoles: ['admin', 'profesor'],
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Resumen del experimento',
  },
  {
    label: 'Generaciones',
    path: '/experiment/:id',
    group: 'Experimentar con IA',
    allowedRoles: ['admin', 'profesor'],
    icon: 'M3 7h18M3 12h18M3 17h18',
    description: 'Todos los individuos'
  },
  {
    label: 'Mejor por Gen.',
    path: '/experiment/:id/best-per-generation',
    group: 'Experimentar con IA',
    allowedRoles: ['admin', 'profesor'],
    icon: 'M5 3l14 9-14 9V3z',
    description: 'Evolución del mejor'
  },
  {
    label: 'Gráficas',
    path: '/experiment/:id/charts',
    group: 'Experimentar con IA',
    allowedRoles: ['admin', 'profesor'],
    icon: 'M3 3v18h18M7 16l4-4 4 4 4-8',
    description: 'Visualización completa'
  },
  {
    label: 'Simulación',
    path: '/simulation/:id',
    group: 'Experimentar con IA',
    allowedRoles: ['admin', 'profesor'],
    icon: 'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
    description: 'Curvas de fermentación'
  },
  {
    label: 'Visualizar Gráficas',
    path: '/grafics',
    group: null,
    allowedRoles: ['admin', 'profesor', 'estudiante'],
    icon: 'M3 3v18h18M7 16l4-4 4 4 4-8',
    description: 'Visualización interactiva'
  },
  {
    label: 'Calculadora de eficiencia',
    path: '/efficiency-calculator',
    group: null,
    allowedRoles: ['admin', 'profesor', 'estudiante'],
    icon: 'M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zM8 7h8v3H8V7zM8 13h2v2H8v-2zm4 0h2v2h-2v-2zm4 0h2v6h-2v-6zM8 17h2v2H8v-2zm4 0h2v2h-2v-2z',
    description: 'Calcular eficiencia'
  },
  {
    label: 'Agregar Usuarios',
    path: '/users/add',
    group: 'Gestión de Usuarios',
    allowedRoles: ['admin', 'profesor'],
    groupDescription: 'Administrar usuarios',
    icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
    description: 'Registrar nuevos usuarios'
  },
  {
    label: 'Administrar Usuarios',
    path: '/users/manage',
    group: 'Gestión de Usuarios',
    allowedRoles: ['admin', 'profesor'],
    icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
    description: 'Gestionar usuarios existentes'
  },
  {
    label: 'Iniciar Fermentación',
    path: '/fermentation',
    group: null,
    allowedRoles: ['admin', 'profesor'],
    icon: 'M9 3h6M10 3v7.5L5 18a1 1 0 00.9 1.5h12.2A1 1 0 0019 18l-5-7.5V3',
    description: 'Iniciar proceso de fermentación'
  },
  {
    label: 'Reportes de Fermentación',
    path: '/fermentation-reports',
    group: null,
    allowedRoles: ['admin', 'profesor', 'estudiante'],
    icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
    description: 'Reportes de fermentación'
  },
  {
    label: 'Comunicados',
    path: '/announcements',
    group: null,
    allowedRoles: ['admin', 'profesor', 'estudiante'],
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.952 9.168-5v10.5c-1.543-3.048-5.068-5-9.168-5H7a3.988 3.988 0 01-1.564-.317z',
    description: 'Avisos y novedades de la plataforma'
  },
  {
    label: 'Mensajes',
    path: '/messages',
    group: null,
    allowedRoles: ['admin', 'profesor', 'estudiante'],
    icon: 'M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z',
    description: 'Chat personal y grupal'
  },
  {
    label: 'Chat IA',
    path: '/chat',
    group: null,
    allowedRoles: ['admin', 'profesor', 'estudiante'],
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    description: 'Asistente FermestBot'
  },
  {
    label: 'Mis Grupos',
    path: '/groups',
    group: null,
    allowedRoles: ['profesor', 'admin'],
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    description: 'Gestión de grupos y clases'
  },
  {
    label: 'Componentes',
    path: '/components',
    group: null,
    allowedRoles: ['admin'],
    icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
    description: 'Gestionar componentes electrónicos del catálogo'
  },
  {
    label: 'Ver Grupos',
    path: '/admin/groups',
    group: null,
    allowedRoles: ['admin'],
    tourId: 'tour-step-admin-groups',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    description: 'Ver todos los grupos de todos los profesores'
  },
  {
    label: 'Soporte',
    path: '/support',
    group: null,
    allowedRoles: ['soporte'],
    icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z',
    description: 'Gestión de tickets de soporte'
  }
]