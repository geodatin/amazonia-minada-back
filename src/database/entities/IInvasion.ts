/* eslint-disable camelcase */
interface IInvasion {
  type: string
  properties: {
    PROCESSO: string
    ID: string
    NUMERO: number
    ANO: number
    AREA_HA: number
    FASE: string
    ULT_EVENTO: string
    NOME: string
    SUBS: string
    USO: string
    UF: string
    UC_COD: string
    UC_NOME: string
    UC_NOMEABREV: string
    UC_SIGLA: string
    UC_BIOMA: string
  }
  geometry: {}
  tweeted: boolean
  created_at: Date
  last_action: string
  last_update_at: Date
  changes: []
}

export { IInvasion }
