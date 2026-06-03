import { motion } from 'motion/react'
import { pageVariants, sectionVariants, cardVariants, gridVariants } from '../../../../shared/animations/variants'
import { useAnnouncementsViewModel } from '../viewmodels/useAnnouncementsViewModel'
import { labelColor }               from '../utils/label-color'
import { linkify } from '../../../../shared/utils/linkify'

const AnnouncementsView = () => {
  const { announcements, loading, error } = useAnnouncementsViewModel()

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{ minHeight: 'calc(100vh - 3.5rem)', backgroundColor: '#0A0A0B', padding: '40px 48px' }}
    >
      <motion.div variants={sectionVariants} style={{ marginBottom: 32 }}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
          Plataforma Nich-ká
        </p>
        <h1 style={{ color: '#F4F4F5', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
          Comunicados
        </h1>
        <div style={{ marginTop: 10, height: 1, width: 80, backgroundColor: '#22C55E', opacity: 0.4 }} />
      </motion.div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
          <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#2A2A2D" strokeWidth="4" />
            <path fill="#22C55E" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {error && (
        <div style={{ padding: '16px 20px', borderRadius: 12, backgroundColor: '#F43F5E10', border: '1px solid #F43F5E30', color: '#F43F5E', fontSize: 13 }}>
          {error}
        </div>
      )}

      {!loading && !error && announcements.length === 0 && (
        <div style={{ textAlign: 'center', paddingTop: 80, color: '#3F3F46', fontSize: 13 }}>
          No hay comunicados disponibles.
        </div>
      )}

      {!loading && !error && announcements.length > 0 && (
        <motion.div
          variants={gridVariants}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}
        >
          {announcements.map(item => {
            const color    = labelColor(item.label)
            const isPinned = item.is_pinned && (!item.pinned_until || new Date(item.pinned_until) > new Date())
            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                style={{
                  display:         'flex',
                  gap:             16,
                  padding:         '18px 20px',
                  borderRadius:    14,
                  backgroundColor: '#111113',
                  border:          isPinned ? '1px solid #F59E0B30' : '1px solid #1F1F22',
                  overflow:        'hidden',
                  position:        'relative',
                }}
              >
                <div style={{
                  position:        'absolute',
                  left:            0,
                  top:             16,
                  bottom:          16,
                  width:           3,
                  borderRadius:    9999,
                  backgroundColor: color,
                  opacity:         0.6,
                }} />

                {isPinned && (
                  <div style={{ position: 'absolute', top: 12, right: 12 }} title="Comunicado fijado">
                    <svg width="13" height="13" viewBox="0 0 17.021 17.021" fill="#F59E0B">
                      <path d="M16.436,4.599l-3.998-4.02c-0.752-0.756-2.063-0.764-2.83-0.006C9.412,0.769,9.258,1.009,9.19,1.202C8.537,2.564,7.836,3.417,6.936,3.929L6.719,4.034C5.751,4.519,4.434,5.013,2,5.013c-0.266,0-0.521,0.052-0.766,0.152C0.75,5.367,0.355,5.76,0.152,6.249c-0.199,0.484-0.199,1.041,0,1.525c0.104,0.249,0.25,0.471,0.435,0.651l3.235,3.235L0,17.013l5.352-3.822l3.227,3.227c0.186,0.189,0.406,0.339,0.656,0.441c0.247,0.103,0.503,0.154,0.766,0.154s0.519-0.052,0.765-0.154c0.498-0.205,0.883-0.592,1.08-1.078c0.103-0.242,0.155-0.507,0.155-0.768c0-2.436,0.494-3.752,0.978-4.721c0.496-0.992,1.369-1.748,2.754-2.414c0.271-0.104,0.51-0.256,0.711-0.457C17.216,6.639,17.212,5.37,16.436,4.599z M11.188,9.4c-0.819,1.643-1.188,3.37-1.195,5.604L2,7.013c2.139,0,3.814-0.335,5.396-1.084l0.235-0.105c1.399-0.699,2.468-1.893,3.388-3.834l3.924,4.051C13.08,6.934,11.887,8.001,11.188,9.4z"/>
                    </svg>
                  </div>
                )}

                <div style={{ paddingLeft: 4, flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{
                      padding:         '2px 8px',
                      borderRadius:    999,
                      backgroundColor: `${color}15`,
                      border:          `1px solid ${color}30`,
                      color,
                      fontSize:        9,
                      fontWeight:      700,
                      letterSpacing:   '0.12em',
                      textTransform:   'uppercase',
                    }}>
                      {item.label}
                    </span>
                    <span style={{ color: '#3F3F46', fontSize: 10, fontFamily: 'monospace' }}>{item.version}</span>
                    <span style={{ color: '#2A2A2D', fontSize: 10 }}>·</span>
                    <span style={{ color: '#3F3F46', fontSize: 10 }}>{item.date}</span>
                  </div>

                  <p style={{ color: '#E4E4E7', fontSize: 13, fontWeight: 600, margin: '0 0 5px 0' }}>
                    {item.title}
                  </p>
                  <p style={{ color: '#52525B', fontSize: 11, margin: 0, lineHeight: 1.6 }}>
                    {linkify(item.description)}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </motion.div>
  )
}

export default AnnouncementsView
