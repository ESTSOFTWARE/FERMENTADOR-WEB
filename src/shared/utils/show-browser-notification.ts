/**
 * Muestra una notificación nativa del navegador (Notifications API).
 * Pide permiso la primera vez; si el usuario lo niega, no hace nada.
 */
export const showBrowserNotification = async (title: string, body: string): Promise<void> => {
  if (!('Notification' in window)) return

  let permission = Notification.permission
  if (permission === 'default') {
    permission = await Notification.requestPermission()
  }
  if (permission !== 'granted') return

  try {
    new Notification(title, { body, icon: '/favicon.ico' })
  } catch { /* algunos navegadores móviles no soportan el constructor */ }
}
