// ID del usuario en sesión. Se lee del mismo storage que useUserAuth (user_data).
const readMyId = (): string => {
  try {
    const raw = localStorage.getItem('user_data')
    if (!raw) return ''
    return String(JSON.parse(raw).id ?? '')
  } catch {
    return ''
  }
}

// Binding viva: se recalcula cuando cambia la identidad (login, sync /users/me,
// cambio de usuario sin recargar). Como es `let` exportado, los módulos que lo
// importan ven siempre el valor actualizado y los mensajes "míos" se alinean bien.
export let MY_ID = readMyId()

if (typeof window !== 'undefined') {
  window.addEventListener('user_data_updated', () => { MY_ID = readMyId() })
  window.addEventListener('session_expired',   () => { MY_ID = '' })
}
