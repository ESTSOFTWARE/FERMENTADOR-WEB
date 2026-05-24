import * as XLSX   from 'xlsx'
import jsPDF       from 'jspdf'
import autoTable   from 'jspdf-autotable'
import type { GroupMember } from '../../domain/models/GroupMember'
import { formatDate }       from './format-date'

type ExportRow = { '#': number; Nombre: string; Correo: string; Registrado: string }

const buildRows = (members: GroupMember[]): ExportRow[] =>
  members.map((m, i) => ({
    '#':          i + 1,
    Nombre:       `${m.name} ${m.last_name}`,
    Correo:       m.email,
    Registrado:   formatDate(m.joined_at, true),
  }))

export const exportCSV = (members: GroupMember[], code: string) => {
  const rows   = buildRows(members)
  const header = Object.keys(rows[0]).join(',')
  const body   = rows.map(r => Object.values(r).map(v => `"${v}"`).join(',')).join('\n')
  const blob   = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' })
  const url    = URL.createObjectURL(blob)
  const a      = document.createElement('a')
  a.href       = url
  a.download   = `alumnos-${code}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export const exportXLSX = (members: GroupMember[], code: string) => {
  const ws = XLSX.utils.json_to_sheet(buildRows(members))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Alumnos')
  XLSX.writeFile(wb, `alumnos-${code}.xlsx`)
}

export const exportPDF = (members: GroupMember[], name: string, subject: string, code: string) => {
  const doc = new jsPDF()
  doc.setFontSize(14)
  doc.text(`Alumnos — ${name} (${subject})`, 14, 16)
  autoTable(doc, {
    startY:     24,
    head:       [['#', 'Nombre', 'Correo', 'Registrado']],
    body:       members.map((m, i) => [i + 1, `${m.name} ${m.last_name}`, m.email, formatDate(m.joined_at, true)]),
    theme:      'grid',
    headStyles: { fillColor: [34, 197, 94] },
    styles:     { fontSize: 9 },
  })
  doc.save(`alumnos-${code}.pdf`)
}
