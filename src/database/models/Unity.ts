/* eslint-disable camelcase */
import mongoose from 'mongoose'

import { IUnity } from '../entities/IUnity'

const UnitySchema = new mongoose.Schema<IUnity>({
  type: String,
  properties: {
    codigoCnuc: String,
    nome: String,
    geometriaA: String,
    anoCriacao: Number,
    sigla: String,
    areaHa: String,
    areaK2: String,
    perimetroM: Number,
    atoLegal: String,
    administra: String,
    SiglaGrupo: String,
    UF: String,
    municipios: String,
    biomaIBGE: String,
    biomaCRL: String,
    CoordRegio: String,
    fusoAbrang: String,
    UORG: String,
    nomeabrev: String,
    en_nome: String,
  },
  geometry: {},
})

export const Unity = mongoose.model('Unity', UnitySchema, 'Unity')
