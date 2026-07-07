import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { User } from '../../models/entities/User'

type ExportRow = {
  '#': number
  Nombre: string
  Correo: string
  Rol: string
  'Cód. activación': string
  Creado: string
}

const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleDateString('es-MX') : '—')

const buildRows = (users: User[]): ExportRow[] =>
  users.map((u, i) => ({
    '#': i + 1,
    Nombre: `${u.name} ${u.last_name}`.trim(),
    Correo: u.email,
    Rol: u.role_name,
    'Cód. activación': u.circuit_code ?? '—',
    Creado: fmtDate(u.created_at),
  }))

export const exportUsersCSV = (users: User[], file = 'usuarios') => {
  const rows = buildRows(users)
  if (rows.length === 0) return
  const header = Object.keys(rows[0]).join(',')
  const body = rows.map(r => Object.values(r).map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${file}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export const exportUsersXLSX = (users: User[], file = 'usuarios') => {
  const ws = XLSX.utils.json_to_sheet(buildRows(users))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Usuarios')
  XLSX.writeFile(wb, `${file}.xlsx`)
}

export const exportUsersPDF = (users: User[], title = 'Usuarios', file = 'usuarios') => {
  const rows = buildRows(users)
  const doc = new jsPDF()
  doc.setFontSize(14)
  doc.text(title, 14, 16)
  autoTable(doc, {
    startY: 22,
    head: [['#', 'Nombre', 'Correo', 'Rol', 'Cód. activación', 'Creado']],
    body: rows.map(r => [r['#'], r.Nombre, r.Correo, r.Rol, r['Cód. activación'], r.Creado]),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [34, 197, 94] },
  })
  doc.save(`${file}.pdf`)
}
