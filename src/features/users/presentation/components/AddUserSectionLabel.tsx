interface Props {
  icon:        React.ReactNode
  title:       string
  description: string
}

export const AddUserSectionLabel = ({ icon, title, description }: Props) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
    <div style={{ marginTop: 2, flexShrink: 0 }}>{icon}</div>
    <div>
      <p style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 600, margin: '0 0 2px 0' }}>{title}</p>
      <p style={{ color: '#3F3F46', fontSize: 11, margin: 0 }}>{description}</p>
    </div>
  </div>
)
