interface IInvasion {
  type: string
  properties: {
    PROCESSO: string
    ID: string
    NUMERO: number
    ANO: number
    AREA_HA: string
    AREA_K2: string
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
    ANO_ATUAL: number
    EN_UC_NOME: string
    EN_FASE: string
    EN_SUBS: string
  }
  geometry: {}
}

export { IInvasion }
