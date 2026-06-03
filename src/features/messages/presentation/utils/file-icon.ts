import { Image as ImageIcon, Film, FileText } from 'lucide-react'

export const fileIcon = (type: string) => {
  if (type === 'image') return ImageIcon
  if (type === 'video') return Film
  return FileText
}
