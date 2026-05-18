import { useNavigate } from 'react-router-dom'
import { useUserAuth } from '../../core/hooks/userAuth'

const ProfileNav = () => {
  const { user } = useUserAuth()
  const navigate = useNavigate()
  const initials = user?.name
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() ?? '?'

  const profileImage = user?.profile_image ?? null

  return (
    <button
      onClick={() => navigate('/profile')}
      className="fixed top-5 right-6 z-50 flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all"
      style={{
        backgroundColor: '#111113',
        border: '1px solid #1F1F22',
        cursor: 'pointer',
      }}
    >
      {profileImage ? (
        <img
          src={profileImage}
          alt="avatar"
          className="w-7 h-7 rounded-full object-cover"
          style={{ border: '1px solid #22C55E30', flexShrink: 0 }}
        />
      ) : (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: '#16A34A33', color: '#22C55E' }}
        >
          {initials}
        </div>
      )}
      <div className="text-left">
        <p className="text-xs font-medium leading-none mb-0.5" style={{ color: '#F4F4F5' }}>
          {user?.name ?? 'Usuario'}
        </p>
        <p style={{ color: '#52525B', fontSize: '10px', lineHeight: 1 }}>
          {user?.email ?? ''}
        </p>
      </div>
    </button>
  )
}

export default ProfileNav