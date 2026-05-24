export type SensorCardProps = {
  label:       string
  unit:        string
  color:       string
  description: string
  data:        { time: string; value: number }[]
  latestValue: number | undefined
}
