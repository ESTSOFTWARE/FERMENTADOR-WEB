import { useState }            from 'react'
import { useNavigate }         from 'react-router-dom'
import { AuthRepositoryImpl }  from '../../data/repositories/AuthRepositoryImpl'
import { LoginUseCase }        from '../../domain/usecases/login.usecase'

const login = new LoginUseCase(new AuthRepositoryImpl())

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
      const user = await login.execute(email, password)
      navigate(user.role?.toLowerCase() === 'soporte' ? '/support' : '/overview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return { email, setEmail, password, setPassword, loading, error, handleSubmit }
}
