/* eslint-disable camelcase */
interface IUnity {
  type: string
  properties: {
    codigoCnuc: string
    nome: string
    geometriaA: string
    anoCriacao: number
    sigla: string
    areaHa: number
    perimetroM: number
    atoLegal: string
    administra: string
    SiglaGrupo: string
    UF: string
    municipios: string
    biomaIBGE: string
    biomaCRL: string
    CoordRegio: string
    fusoAbrang: string
    UORG: string
    nomeabrev: string
  }
  geometry: {}
}

export { IUnity }
