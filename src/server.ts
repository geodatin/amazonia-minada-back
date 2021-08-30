import 'reflect-metadata'
import express from 'express'

import { router } from './routes'

import './database'
import './shared/container'

const app = express()

app.use(router)

app.listen(3333, () => console.log('Server is running!'))
