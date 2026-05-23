import { motion, AnimatePresence } from 'motion/react'
import { sileo } from 'sileo'
import { pageVariants, sectionVariants } from '../../../../shared/animations/variants'
import { useGroupsViewModel } from '../viewmodels/useGroupsViewModel'
import { GroupsGrid } from '../components/GroupsGrid'
import { useUserAuth } from '../../../../core/hooks/userAuth'

const modalVariants = {
  hidden:  { opacity: 0, scale: 0.95, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] as [number, number, number, number] } },
  exit:    { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15 } },
}

const GroupsView = () => {
  const vm       = useGroupsViewModel()
  const { user } = useUserAuth()

  const confirmDelete = (id: number, name: string) => {
    const toastId = sileo.action({
      title: 'Eliminar grupo',
      description: (
        <div className="flex flex-col gap-2">
          <span style={{ color: '#A1A1AA', fontSize: 12 }}>
            ¿Seguro que quieres eliminar "{name}"? Esta acción no se puede deshacer.
          </span>
          <button
            onPointerDown={e => { e.stopPropagation(); sileo.dismiss(toastId) }}
            style={{ fontSize: 11, color: '#52525B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            No, mantener grupo
          </button>
        </div>
      ),
      fill:     '#1A1A1A',
      duration: null,
      styles:   { title: 'text-white' },
      button: {
        title:   'Eliminar',
        onClick: () => { sileo.dismiss(toastId); vm.deleteGroup(id) },
      },
    })
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      style={{ minHeight: '100vh', backgroundColor: '#0A0A0B', padding: '40px 48px' }}
    >
      {/* Header */}
      <motion.div variants={sectionVariants} style={{ marginBottom: 32, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 10px 0' }}>
            Gestión de Grupos
          </p>
          <h1 style={{ color: '#F4F4F5', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
            Mis Grupos
          </h1>
          <div style={{ marginTop: 10, height: 1, width: 80, backgroundColor: '#22C55E', opacity: 0.4 }} />
        </div>
        <button
          onClick={() => vm.setShowCreate(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 18px', borderRadius: 10,
            backgroundColor: '#ffffff', color: '#0A0A0B',
            border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 4v16m8-8H4" />
          </svg>
          Nuevo grupo
        </button>
      </motion.div>

      {/* Loading */}
      {vm.loading && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
          <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#2A2A2D" strokeWidth="4" />
            <path fill="#22C55E" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {/* Empty */}
      {!vm.loading && vm.groups.length === 0 && (
        <div style={{ textAlign: 'center', paddingTop: 80, color: '#3F3F46', fontSize: 13 }}>
          Aún no tienes grupos. Crea el primero.
        </div>
      )}

      {/* Grid */}
      {!vm.loading && vm.groups.length > 0 && (
        <motion.div variants={sectionVariants}>
          <GroupsGrid
            groups={vm.groups}
            user={user}
            onConfirmDelete={confirmDelete}
          />
        </motion.div>
      )}

      {/* Modal crear grupo */}
      <AnimatePresence>
        {vm.showCreate && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { vm.setShowCreate(false); vm.resetCreate() }}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 50 }}
            />
            <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 51, pointerEvents: 'none' }}>
              <motion.div
                variants={modalVariants} initial="hidden" animate="visible" exit="exit"
                style={{
                  width: 420, padding: '28px 28px 24px', borderRadius: 16,
                  backgroundColor: '#111113', border: '1px solid #2A2A2D', pointerEvents: 'auto',
                }}
              >
                <h3 style={{ color: '#F4F4F5', fontSize: 16, fontWeight: 600, margin: '0 0 20px 0' }}>Nuevo grupo</h3>

                {/* Imagen de portada */}
                <label style={{ color: '#71717A', fontSize: 12, display: 'block', marginBottom: 6 }}>Portada (opcional)</label>
                <label style={{ display: 'block', cursor: 'pointer', marginBottom: 16 }}>
                  <input type="file" accept="image/jpeg,image/png,image/webp" style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files?.[0]; if (f) vm.pickCover(f) }} />
                  <div style={{
                    width: '100%', height: 120, borderRadius: 10, border: '1px dashed #2A2A2D',
                    backgroundColor: '#0A0A0B', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {vm.coverPreview
                      ? <img src={vm.coverPreview} alt="portada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ textAlign: 'center', color: '#3F3F46' }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ margin: '0 auto 6px' }}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          <p style={{ fontSize: 11 }}>Clic para subir imagen</p>
                        </div>
                    }
                  </div>
                </label>

                {/* Nombre */}
                <label style={{ color: '#71717A', fontSize: 12, display: 'block', marginBottom: 6 }}>Nombre del grupo</label>
                <input
                  autoFocus
                  value={vm.createName}
                  onChange={e => vm.setCreateName(e.target.value)}
                  placeholder="Ej. 5A Biotecnología"
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 14,
                    backgroundColor: '#0A0A0B', border: '1px solid #2A2A2D',
                    color: '#F4F4F5', outline: 'none', boxSizing: 'border-box',
                  }}
                />

                {/* Materia */}
                <label style={{ color: '#71717A', fontSize: 12, display: 'block', marginBottom: 6 }}>Materia</label>
                <input
                  value={vm.createSubject}
                  onChange={e => vm.setCreateSubject(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && vm.createGroup()}
                  placeholder="Ej. Biotecnología Industrial"
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 13,
                    backgroundColor: '#0A0A0B', border: '1px solid #2A2A2D',
                    color: '#F4F4F5', outline: 'none', boxSizing: 'border-box',
                  }}
                />

                <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                  <button
                    onClick={() => { vm.setShowCreate(false); vm.resetCreate() }}
                    style={{ flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 13, backgroundColor: '#1F1F22', border: '1px solid #2A2A2D', color: '#A1A1AA', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={vm.createGroup}
                    disabled={vm.saving || !vm.createName.trim() || !vm.createSubject.trim()}
                    style={{
                      flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 13, fontWeight: 600,
                      backgroundColor: vm.saving || !vm.createName.trim() || !vm.createSubject.trim() ? '#2A2A2D' : '#ffffff',
                      color: vm.saving || !vm.createName.trim() || !vm.createSubject.trim() ? '#52525B' : '#0A0A0B',
                      border: 'none', cursor: vm.saving ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {vm.saving ? 'Creando...' : 'Crear grupo'}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default GroupsView
