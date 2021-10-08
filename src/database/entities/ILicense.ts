interface ILicense {
  type: string
  properties: {
    PROCESSO: string
    NUMERO: number
    ANO: number
    AREA_HA: number
    ID: string
    FASE: string
    ULT_EVENTO: string
    NOME: string
    SUBS: string
    USO: string
    UF: string
    DSProcesso: string
  }
  geometry: {}
}

export { ILicense }
