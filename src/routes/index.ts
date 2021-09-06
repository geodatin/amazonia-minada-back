import { Router } from 'express'

import { GetStatisticsController } from '../services/getStatistics/GetStatisticsController'
import { ListInvasionsController } from '../services/listInvasions/ListInvasionsController'
import { SearchController } from '../services/search/SearchController'

const router = Router()

const searchController = new SearchController()
const listInvasionsController = new ListInvasionsController()
const getStatisticsController = new GetStatisticsController()

router.get('/search/:searchTerm', searchController.handle)
router.post('/invasions', listInvasionsController.handle)
router.post('/statistics', getStatisticsController.handle)

export { router }
