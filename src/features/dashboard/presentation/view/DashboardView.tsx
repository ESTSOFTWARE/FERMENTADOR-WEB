import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboardViewModel } from '../viewmodels/useDashboardViewModel'
import type { RunExperimentRequest } from '../../domain/models/RunExperiment'
import { useExperimentStore } from '../../../../core/store/useExperimentStore'
import { fields } from '../constants/fields'
import LoadingScreen from '../components/LoadingScreen'
import ParameterSlider from '../components/ParameterSlider'
import MicroorganismSelector from '../components/MicroorganismSelector'
import ExperimentSummary from '../components/ExperimentSummary'
import { motion } from 'motion/react'
import { pageVariants, sectionVariants, gridVariants, cardVariants } from '../../../../shared/animations/variants'

const DashboardView = () => {
  const navigate                        = useNavigate()
  const { setExperimentId, setLastResult } = useExperimentStore()
  const { loading, error, runExperiment }  = useDashboardViewModel()
  const [elapsed, setElapsed]           = useState(0)
  const intervalRef                     = useRef<ReturnType<typeof setInterval> | null>(null)

  const [form, setForm] = useState<RunExperimentRequest>({
    ph:             7.0,
    temperature:    25,
    sugar:          10,
    microorganism:  'saccharomyces',
    micro_amount:   1.5,
  })

  useEffect(() => {
    if (!loading) { const t = setTimeout(() => setElapsed(0), 0); return () => clearTimeout(t) }
    const interval = setInterval(() => setElapsed(prev => prev + 1), 1000)
    return () => clearInterval(interval)
  }, [loading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'microorganism' ? value : Number(value) }))
  }

  const handleSubmit = async () => {
    const result = await runExperiment(form)
    if (result?.experiment_id) {
      setExperimentId(result.experiment_id)
      setLastResult(result)
      navigate(`/results/${result.experiment_id}`)
    }
  }

  const startStep = (fieldName: string, step: number, min: number, max: number, direction: number) => {
    setForm(prev => {
      const current  = prev[fieldName as keyof RunExperimentRequest] as number
      const newValue = Math.min(max, Math.max(min, Number((current + direction * step).toFixed(2))))
      return { ...prev, [fieldName]: newValue }
    })
    intervalRef.current = setInterval(() => {
      setForm(prev => {
        const current  = prev[fieldName as keyof RunExperimentRequest] as number
        const newValue = Math.min(max, Math.max(min, Number((current + direction * step).toFixed(2))))
        return { ...prev, [fieldName]: newValue }
      })
    }, 150)
  }

  const stopStep = () => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null }
  }

  if (loading) return <LoadingScreen elapsed={elapsed} />

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen flex flex-col px-12 py-12"
      style={{ backgroundColor: '#0A0A0B' }}
    >

      <motion.div variants={sectionVariants} className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#22C55E' }}>
          Algoritmo Genético
        </p>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#F4F4F5' }}>
          Nuevo Experimento
        </h1>
        <div className="mt-3 h-px w-24" style={{ backgroundColor: '#22C55E', opacity: 0.4 }} />
      </motion.div>

      <motion.div variants={gridVariants} className="flex-1 grid grid-cols-3 gap-6">
        <motion.div variants={cardVariants} className="col-span-2 flex flex-col gap-4">
          {fields.map(field => (
            <ParameterSlider
              key={field.name}
              {...field}
              value={form[field.name as keyof RunExperimentRequest] as number}
              onChange={handleChange}
              onStep={startStep}
              onStopStep={stopStep}
            />
          ))}
        </motion.div>

        <motion.div variants={cardVariants} className="flex flex-col gap-4">
          <MicroorganismSelector
            selected={form.microorganism}
            onSelect={value => setForm(prev => ({ ...prev, microorganism: value }))}
          />
          <ExperimentSummary
            form={form}
            error={error}
            onSubmit={handleSubmit}
          />
        </motion.div>
      </motion.div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #22C55E;
          cursor: pointer;
          border: 2px solid #0A0A0B;
          box-shadow: 0 0 0 2px #22C55E;
        }
      `}</style>
    </motion.div>
  )
}

export default DashboardView