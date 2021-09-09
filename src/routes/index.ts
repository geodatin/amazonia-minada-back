import { Router } from 'express'

import { GetStatisticsController } from '../services/getStatistics/GetStatisticsController'
import { InvasionFrequencyController } from '../services/invasionRanking/InvasionRankingController'
import { ListInvasionsController } from '../services/listInvasions/ListInvasionsController'
import { SearchController } from '../services/search/SearchController'

const router = Router()

const searchController = new SearchController()
const listInvasionsController = new ListInvasionsController()
const invasionFrequencyController = new InvasionFrequencyController()
const getStatisticsController = new GetStatisticsController()

router.get('/search/:searchTerm', searchController.handle)
router.post('/invasions', listInvasionsController.handle)
router.get(
  '/invasions/ranking/:territoryType/:dataType',
  invasionFrequencyController.handle
)
router.post('/statistics', getStatisticsController.handle)

export { router }
