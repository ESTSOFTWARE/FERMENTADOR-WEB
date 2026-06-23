import { useState, useEffect }  from 'react'
import { UserRepositoryImpl }   from '../../data/repositories/UserRepositoryImpl'
import { CreateUserUseCase }    from '../../domain/usecases/create-user.usecase'
import { useUserAuth }          from '../../../../core/hooks/userAuth'
import { apiClient }            from '../../../../core/network/client'
import type { AddUserForm }     from '../types/add-user-form.types'

const createUser = new CreateUserUseCase(new UserRepositoryImpl())

const initialForm: AddUserForm = {
  name:      '',
  last_name: '',
  email:     '',
  password:  '',
  confirm:   '',
  role:      'estudiante',
}

export const useAddUserViewModel = () => {
  const { user } = useUserAuth()

  const isProfesor = (user?.role ?? '') === 'profesor'

  const [form,           setForm]           = useState<AddUserForm>(initialForm)
  const [activationCode, setActivationCode] = useState<string | null>(null)
  const [loading,        setLoading]        = useState(false)
  const [success,        setSuccess]        = useState(false)
  const [error,          setError]          = useState<string | null>(null)
  const [showPassword,   setShowPassword]   = useState(false)
  const [showConfirm,    setShowConfirm]    = useState(false)

  useEffect(() => {
    if (!user?.id) return

    const loadCode = (circuitId: number) =>
      apiClient.get<{ activation_code: string | null }>(`/circuits/${circuitId}`)
        .then(data => setActivationCode(data.activation_code ?? null))
        .catch(() => setError('No se pudo obtener el código del circuito.'))

    // Si el circuit_id ya está en sesión, úsalo
    if (user.circuit_id) { loadCode(user.circuit_id); return }

    // Si no, consúltalo fresco del backend (puede no estar en el localStorage)
    apiClient.get<{ circuit_id: number | null }>(`/users/${user.id}`)
      .then(profile => {
        if (profile.circuit_id) loadCode(profile.circuit_id)
        else setError('Tu cuenta no tiene un circuito asignado. Pídele al administrador que te vincule a un circuito antes de crear usuarios.')
      })
      .catch(() => {})
  }, [user?.id, user?.circuit_id])

  const set = (key: keyof AddUserForm, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const mismatch = form.confirm !== '' && form.password !== form.confirm
  const isValid  = !!(
    form.name && form.last_name && form.email &&
    form.password && !mismatch && form.role && activationCode
  )

  const handleSubmit = async () => {
    if (!isValid || !activationCode) return
    setLoading(true)
    setError(null)
    try {
      await createUser.execute({
        name:            form.name,
        last_name:       form.last_name,
        email:           form.email,
        password:        form.password,
        role:            isProfesor ? 'estudiante' : form.role,
        activation_code: activationCode,
      })
      setSuccess(true)
      setForm(initialForm)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear el usuario.')
    } finally {
      setLoading(false)
    }
  }

  return {
    form, set, mismatch, isValid,
    loading, success, error,
    showPassword, setShowPassword,
    showConfirm,  setShowConfirm,
    handleSubmit,
    isProfesor,
  }
}
