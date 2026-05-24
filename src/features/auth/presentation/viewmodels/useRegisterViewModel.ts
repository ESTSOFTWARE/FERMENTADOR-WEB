import { useState }           from 'react'
import { useNavigate }        from 'react-router-dom'
import { AuthRepositoryImpl } from '../../data/repositories/AuthRepositoryImpl'
import { RegisterUseCase }    from '../../domain/usecases/register.usecase'

const register = new RegisterUseCase(new AuthRepositoryImpl())

export const useRegisterViewModel = () => {
  const navigate = useNavigate()

  const [name, setName]         = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      const registeredEmail = await register.execute(name, lastName, email, password)
      navigate('/login', { state: { registered: true, email: registeredEmail } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return {
    name,      setName,
    lastName,  setLastName,
    email,     setEmail,
    password,  setPassword,
    confirm,   setConfirm,
    loading,
    error,
    handleSubmit,
  }
}
