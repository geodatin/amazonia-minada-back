import { Router } from 'express'

import { GetReservesPhaseController } from '../services/getReservesPhase/GetReservesPhaseController'
import { GetStatisticsController } from '../services/getStatistics/GetStatisticsController'
import { InvasionFrequencyController } from '../services/invasionRanking/InvasionRankingController'
import { ListInvasionsController } from '../services/listInvasions/ListInvasionsController'
import { SearchController } from '../services/search/SearchController'

const router = Router()

const searchController = new SearchController()
const listInvasionsController = new ListInvasionsController()
const invasionFrequencyController = new InvasionFrequencyController()
const getStatisticsController = new GetStatisticsController()
const getReservesPhaseController = new GetReservesPhaseController()

router.get('/search/:searchTerm', searchController.handle)
router.post('/invasions', listInvasionsController.handle)
router.get(
  '/invasions/ranking/:territoryType/:dataType',
  invasionFrequencyController.handle
)
router.post('/statistics', getStatisticsController.handle)
router.get('/reserves/phase', getReservesPhaseController.handle)

export { router }
