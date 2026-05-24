import { useState }            from 'react'
import { getEfficiencyColor } from '../utils/get-efficiency-color'
import { getEfficiencyLabel } from '../utils/get-efficiency-label'

export const useEfficiencyViewModel = () => {
  const [azucarInicial,   setAzucarInicial]   = useState('')
  const [etanolDetectado, setEtanolDetectado] = useState('')

  const azucar = parseFloat(azucarInicial)
  const etanol = parseFloat(etanolDetectado)

  const etanolTeorico = isNaN(azucar) ? 0 : azucar * 0.511
  const eficiencia    = etanolTeorico > 0 && !isNaN(etanol)
    ? Math.min(100, Math.max(0, (etanol / etanolTeorico) * 100))
    : 0
  const eficienciaPct = Math.round(eficiencia * 10) / 10
  const color         = getEfficiencyColor(eficienciaPct)
  const label         = getEfficiencyLabel(eficienciaPct)
  const hasResult     = !isNaN(azucar) && !isNaN(etanol) && azucar > 0 && etanol >= 0

  return {
    azucarInicial,
    setAzucarInicial,
    etanolDetectado,
    setEtanolDetectado,
    azucar,
    etanol,
    etanolTeorico,
    eficienciaPct,
    color,
    label,
    hasResult,
  }
}
