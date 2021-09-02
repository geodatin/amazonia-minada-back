import { Router } from 'express'

import { ListInvasionsController } from '../services/listInvasions/ListInvasionsController'
import { SearchController } from '../services/search/SearchController'

const router = Router()

const searchController = new SearchController()
const listInvasionsController = new ListInvasionsController()

router.get('/search', searchController.handle)
router.post('/invasions', listInvasionsController.handle)

export { router }
