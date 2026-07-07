import { useState, type CSSProperties } from 'react'

interface Props {
  src?:       string | null
  name:       string
  className?: string
  style?:     CSSProperties
}

const initialsFromName = (name: string): string =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')

/**
 * Avatar de usuario: muestra la foto de perfil si es una URL http(s) válida,
 * y cae a las iniciales si no hay foto o falla la carga. El tamaño y los
 * colores se controlan con `className` / `style` del contenedor.
 */
export const UserAvatar = ({ src, name, className, style }: Props) => {
  const [failed, setFailed] = useState(false)
  const valid = !!src && /^https?:\/\//.test(src) && !failed

  return (
    <div className={className} style={{ overflow: 'hidden', ...style }}>
      {valid
        ? <img
            src={src!}
            alt={name}
            onError={() => setFailed(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        : initialsFromName(name)}
    </div>
  )
}
