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

export const MY_ID = readMyId()
