import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const AuthCallbackView = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken  = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const userDataB64  = searchParams.get('user_data')

    if (!accessToken || !refreshToken) {
      navigate('/login', { replace: true })
      return
    }

    localStorage.setItem('access_token',  accessToken)
    localStorage.setItem('refresh_token', refreshToken)

    let role = ''
    if (userDataB64) {
      try {
        const userData = JSON.parse(atob(userDataB64))
        localStorage.setItem('user_data', JSON.stringify(userData))
        role = userData.role?.toLowerCase() ?? ''
      } catch {
        // si falla el decode se navega a overview igualmente
      }
    }

    navigate(role === 'soporte' ? '/support' : '/overview', { replace: true })
  }, [navigate, searchParams])

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0A0A0B]">
      <div className="flex flex-col items-center gap-4">
        <svg className="animate-spin w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <p className="text-neutral-500 text-sm">Iniciando sesión...</p>
      </div>
    </div>
  )
}

export default AuthCallbackView
