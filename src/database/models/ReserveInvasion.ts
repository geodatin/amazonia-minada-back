/* eslint-disable camelcase */
import mongoose from 'mongoose'

import { IReserveInvasion } from '../entities/IReserveInvasion'

const ReserveInvasionSchema = new mongoose.Schema<IReserveInvasion>({
  type: String,
  properties: {
    PROCESSO: String,
    ID: String,
    NUMERO: Number,
    ANO: Number,
    AREA_HA: Number,
    FASE: String,
    ULT_EVENTO: String,
    NOME: String,
    SUBS: String,
    USO: String,
    UF: String,
    TI_NOME: String,
    TI_ETNIA: String,
    TI_MUNICIPIO: String,
    TI_UF: String,
    TI_SUPERFICIE: String,
    TI_FASE: String,
    TI_MODALIDADE: String,
  },
  geometry: {},
  tweeted: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
  last_action: String,
  last_update_at: {
    type: Date,
    default: new Date(),
  },
  changes: [
    {
      _id: false,
      timestamp: {
        type: Date,
        default: new Date(),
      },
      changes: String,
    },
  ],
})

export const ReserveInvasion = mongoose.model(
  'ReserveInvasion',
  ReserveInvasionSchema
)
