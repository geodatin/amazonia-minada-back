interface IInvasionDTO {
  id: string
  company: string
  process: string
  area: number
  year: number
  state: string
  use: string
  lastEvent: string
  miningProcess: string
  miningProcessType?: string
  substance: string
  territory: string
  reservePhase?: string
  reserveEthnicity?: string
  type: string
}

export { IInvasionDTO }
