/* eslint-disable camelcase */
interface IReserve {
  type: string
  properties: {
    gid: number
    terrai_cod: number
    terrai_nom: string
    etnia_nome: string
    municipio_: string
    uf_sigla: string
    superfice: number
    fase_ti: string
    modalidade: string
    reestudo_t: string
    cr: string
    faixa_fron: string
    undadm_cod: number
    undadm_nom: string
    undadm_sig: string
  }
  geometry: {}
}

export { IReserve }
