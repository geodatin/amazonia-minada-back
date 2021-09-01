interface IReserveInvasion {
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
    TI_NOME: string
    TI_ETNIA: string
    TI_MUNICIPIO: string
    TI_UF: string
    TI_SUPERFICIE: string
    TI_FASE: string
    TI_MODALIDADE: string
  }
  geometry: {}
}

export { IReserveInvasion }
