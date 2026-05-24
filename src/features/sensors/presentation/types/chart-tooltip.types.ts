interface TooltipPayloadItem { value: number }

export interface ChartTooltipProps {
  active?:  boolean
  payload?: TooltipPayloadItem[]
  label?:   string
  unit?:    string
}
