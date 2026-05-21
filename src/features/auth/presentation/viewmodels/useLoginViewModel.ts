import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl'

const repository = new AuthRepositoryImpl()

export const useLoginViewModel = () => {
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await repository.login({ email, password })

      // Guardar tokens
      localStorage.setItem('access_token',  data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)

      // Guardar datos del usuario — useAuth los leerá desde aquí
      // El JWT solo incluye sub, role y circuit_id; name y email NO están en el payload
      localStorage.setItem('user_data', JSON.stringify(data.user))

      const role = data.user.role?.toLowerCase()
      navigate(role === 'soporte' ? '/support' : '/overview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return { email, setEmail, password, setPassword, loading, error, handleSubmit }
}