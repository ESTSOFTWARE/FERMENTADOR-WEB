import type { Status } from '../../presentation/types/Status'

export type Report = {
  id:       number
  circuit:  number
  start:    string
  end:      string
  duration: string
  ph:       number
  temp:     number
  sugar:    number
  etanol:   number
  status:   Status
}
