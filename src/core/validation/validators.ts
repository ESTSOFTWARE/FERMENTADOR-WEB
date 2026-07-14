const EMAIL_RE = /^[\w.+-]+@[\w-]+\.[\w.-]+$/
const NAME_RE  = /^[A-Za-zÀ-ÿ' .-]+$/
const LETTER_RE = /[A-Za-zÀ-ÿ]/
const DIGIT_RE  = /\d/

export const required = (v: string, field = 'Este campo'): string =>
  v.trim() ? '' : `${field} es requerido`

export const email = (v: string): string => {
  const value = v.trim()
  if (!value) return 'El correo es requerido'
  if (value.length > 254 || !EMAIL_RE.test(value)) return 'Correo electrónico inválido'
  return ''
}

export const personName = (v: string, field = 'Este campo'): string => {
  const value = v.trim()
  if (!value) return `${field} es requerido`
  if (value.length < 2) return 'Muy corto'
  if (value.length > 50) return 'Máximo 50 caracteres'
  if (!NAME_RE.test(value)) return 'Solo letras'
  return ''
}

export const password = (v: string): string => {
  if (!v) return 'La contraseña es requerida'
  if (v.length < 8) return 'Mínimo 8 caracteres'
  if (v.length > 128) return 'La contraseña es demasiado larga'
  if (!LETTER_RE.test(v) || !DIGIT_RE.test(v)) return 'Debe incluir letras y números'
  return ''
}

export const loginPassword = (v: string): string =>
  v ? '' : 'La contraseña es requerida'

export const matches = (v: string, other: string, msg = 'No coinciden'): string =>
  v === other ? '' : msg

export const maxLength = (v: string, n: number, field = 'Este campo'): string =>
  v.length > n ? `${field} no puede superar ${n} caracteres` : ''
