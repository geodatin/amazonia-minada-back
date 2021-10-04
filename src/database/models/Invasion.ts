/* eslint-disable camelcase */
import mongoose from 'mongoose'

import { IInvasion } from '../entities/IInvasion'

const InvasionSchema = new mongoose.Schema<IInvasion>({
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
    UC_COD: String,
    UC_NOME: String,
    UC_NOMEABREV: String,
    UC_SIGLA: String,
    UC_BIOMA: String,
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

export const Invasion = mongoose.model('Invasion', InvasionSchema)
