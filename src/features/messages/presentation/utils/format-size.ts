export const formatSize = (bytes?: number): string => {
  if (!bytes) return ''
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}
