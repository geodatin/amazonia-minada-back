/* eslint-disable camelcase */
import mongoose from 'mongoose'

import { ILicense } from '../entities/ILicense'

const LicenseSchema = new mongoose.Schema<ILicense>({
  type: String,
  properties: {
    PROCESSO: String,
    NUMERO: Number,
    ANO: Number,
    AREA_HA: Number,
    ID: String,
    FASE: String,
    ULT_EVENTO: String,
    NOME: String,
    SUBS: String,
    USO: String,
    UF: String,
    DSProcesso: String,
  },
  geometry: {},
})

export const License = mongoose.model('License', LicenseSchema)
