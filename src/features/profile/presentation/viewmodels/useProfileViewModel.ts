import { useState, useCallback, useEffect } from 'react'
import { ProfileRepositoryImpl }            from '../../data/repositories/ProfileRepositoryImpl'
import { GetUserProfileUseCase }            from '../../domain/usecases/get-user-profile.usecase'
import { UpdateUserInfoUseCase }            from '../../domain/usecases/update-user-info.usecase'
import { ChangePasswordUseCase }            from '../../domain/usecases/change-password.usecase'
import { UploadProfileImageUseCase }        from '../../domain/usecases/upload-profile-image.usecase'
import { ActivateCircuitUseCase }           from '../../domain/usecases/activate-circuit.usecase'
import { notifyUserUpdated, useUserAuth }   from '../../../../core/hooks/userAuth'
import type { InfoForm }                    from '../types/info-form.types'
import type { PasswordForm }                from '../types/password-form.types'

const repo              = new ProfileRepositoryImpl()
const getUserProfile    = new GetUserProfileUseCase(repo)
const updateUserInfo    = new UpdateUserInfoUseCase(repo)
const changePassword    = new ChangePasswordUseCase(repo)
const uploadImage       = new UploadProfileImageUseCase(repo)
const activateCircuit   = new ActivateCircuitUseCase(repo)

export const useProfileViewModel = () => {
  const { user } = useUserAuth()

  const [infoForm, setInfoForm] = useState<InfoForm>({
    name:         user?.name         ?? '',
    last_name:    user?.last_name    ?? '',
    email:        user?.email        ?? '',
    dial_code:    user?.dial_code    ?? '+52',
    phone_number: user?.phone_number ?? '',
  })
  const [editingInfo, setEditingInfo] = useState(false)
  const [loadingInfo, setLoadingInfo] = useState(false)
  const [successInfo, setSuccessInfo] = useState(false)
  const [errorInfo,   setErrorInfo]   = useState<string | null>(null)

  const [pwForm, setPwForm] = useState<PasswordForm>({ current: '', next: '', confirm: '' })
  const [loadingPw, setLoadingPw] = useState(false)
  const [successPw, setSuccessPw] = useState(false)
  const [errorPw,   setErrorPw]   = useState<string | null>(null)

  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    user?.profile_image ?? localStorage.getItem('profile_image') ?? null
  )
  const [pickingAvatar, setPickingAvatar] = useState(false)
  const [loadingImage,  setLoadingImage]  = useState(false)
  const [errorImage,    setErrorImage]    = useState<string | null>(null)

  const [circuitId,         setCircuitId]         = useState<number | null>(user?.circuit_id ?? null)
  const [createdBy,         setCreatedBy]         = useState<number | null>(null)
  const [activationCode,    setActivationCode]    = useState('')
  const [loadingActivation, setLoadingActivation] = useState(false)
  const [successActivation, setSuccessActivation] = useState(false)
  const [errorActivation,   setErrorActivation]   = useState<string | null>(null)

  useEffect(() => {
    if (!user?.id) return
    getUserProfile.execute(user.id).then(profile => {
      setInfoForm(prev => ({
        ...prev,
        dial_code:    profile.dial_code    ?? prev.dial_code,
        phone_number: profile.phone_number ?? prev.phone_number,
      }))
      setCreatedBy(profile.created_by)
      const stored = localStorage.getItem('user_data')
      if (stored) {
        localStorage.setItem('user_data', JSON.stringify({
          ...JSON.parse(stored),
          dial_code:    profile.dial_code,
          phone_number: profile.phone_number,
        }))
      }
    }).catch(() => {})
  }, [user?.id])

  const pwMismatch  = pwForm.confirm !== '' && pwForm.next !== pwForm.confirm
  const pwValid     = !!(pwForm.current && pwForm.next && pwForm.next === pwForm.confirm && pwForm.next.length >= 8)
  const infoChanged =
    infoForm.name         !== (user?.name         ?? '') ||
    infoForm.last_name    !== (user?.last_name    ?? '') ||
    infoForm.email        !== (user?.email        ?? '') ||
    infoForm.phone_number !== ''
  const hasCircuit = circuitId !== null
  const isVerified =
    (user?.role === 'admin'    && circuitId !== null) ||
    (user?.role === 'profesor' && createdBy !== null)

  const setInfo = (key: keyof InfoForm,    val: string) => setInfoForm(prev => ({ ...prev, [key]: val }))
  const setPw   = (key: keyof PasswordForm,val: string) => setPwForm(prev => ({ ...prev, [key]: val }))

  const handleSaveInfo = useCallback(async () => {
    if (!infoChanged || !user) return
    setLoadingInfo(true); setErrorInfo(null)
    try {
      await updateUserInfo.execute(user.id, {
        name: infoForm.name, last_name: infoForm.last_name,
        email: infoForm.email, dial_code: infoForm.dial_code, phone_number: infoForm.phone_number,
      })
      notifyUserUpdated()
      setSuccessInfo(true); setEditingInfo(false)
      setTimeout(() => setSuccessInfo(false), 3000)
    } catch (err) {
      setErrorInfo(err instanceof Error ? err.message : 'Error al actualizar la información.')
    } finally {
      setLoadingInfo(false)
    }
  }, [infoChanged, infoForm, user])

  const handleCancelInfo = useCallback(() => {
    setEditingInfo(false)
    setInfoForm({ name: user?.name ?? '', last_name: user?.last_name ?? '', email: user?.email ?? '', dial_code: user?.dial_code ?? '+52', phone_number: user?.phone_number ?? '' })
    setErrorInfo(null)
  }, [user])

  const handleSavePw = useCallback(async () => {
    if (!pwValid) return
    setLoadingPw(true); setErrorPw(null)
    try {
      await changePassword.execute({
        current_password: pwForm.current,
        new_password:     pwForm.next,
        confirm_password: pwForm.confirm,
      })
      setSuccessPw(true)
      setPwForm({ current: '', next: '', confirm: '' })
      setTimeout(() => setSuccessPw(false), 3000)
    } catch (err) {
      setErrorPw(err instanceof Error ? err.message : 'Error al cambiar la contraseña.')
    } finally {
      setLoadingPw(false)
    }
  }, [pwValid, pwForm])

  const handleSelectAvatar = useCallback((path: string) => {
    setSelectedAvatar(path)
    localStorage.setItem('profile_image', path)
    setPickingAvatar(false)
  }, [])

  const handleUploadImage = useCallback(async (file: File) => {
    setLoadingImage(true); setErrorImage(null)
    try {
      const profile_image = await uploadImage.execute(file)
      setSelectedAvatar(profile_image)
      notifyUserUpdated()
    } catch (err) {
      setErrorImage(err instanceof Error ? err.message : 'Error al subir la imagen.')
    } finally {
      setLoadingImage(false)
    }
  }, [])

  const handleActivateCircuit = useCallback(async () => {
    const code = activationCode.trim().toUpperCase()
    if (code.length !== 8) { setErrorActivation('El código debe tener 8 caracteres.'); return }
    setLoadingActivation(true); setErrorActivation(null); setSuccessActivation(false)
    try {
      const circuit_id = await activateCircuit.execute({ activation_code: code })
      notifyUserUpdated()
      setCircuitId(circuit_id)
      setSuccessActivation(true)
      setActivationCode('')
      setTimeout(() => setSuccessActivation(false), 4000)
    } catch (err) {
      setErrorActivation(err instanceof Error ? err.message : 'Error al activar el circuito.')
    } finally {
      setLoadingActivation(false)
    }
  }, [activationCode])

  return {
    user, infoForm, pwForm, selectedAvatar, pickingAvatar,
    circuitId, activationCode, hasCircuit, isVerified,
    editingInfo, loadingInfo, loadingPw, loadingActivation, loadingImage,
    successInfo, successPw, successActivation,
    errorInfo, errorPw, errorActivation, errorImage,
    pwMismatch, pwValid, infoChanged,
    setInfo, setPw, setEditingInfo, setPickingAvatar, setActivationCode,
    handleSaveInfo, handleCancelInfo, handleSavePw,
    handleSelectAvatar, handleUploadImage, handleActivateCircuit,
  }
}
