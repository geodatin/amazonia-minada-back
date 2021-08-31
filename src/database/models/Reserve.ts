/* eslint-disable camelcase */
import mongoose from 'mongoose'

import { IReserve } from '../entities/IReserve'

const ReserveSchema = new mongoose.Schema<IReserve>({
  type: String,
  properties: {
    gid: Number,
    terrai_cod: Number,
    terrai_nom: String,
    etnia_nome: String,
    municipio_: String,
    uf_sigla: String,
    superfice: String,
    superficieK2: String,
    fase_ti: String,
    modalidade: String,
    reestudo_t: String,
    cr: String,
    faixa_fron: String,
    undadm_cod: Number,
    undadm_nom: String,
    undadm_sig: String,
  },
  geometry: {},
})

export const Reserve = mongoose.model('Reserve', ReserveSchema, 'Reserve')
