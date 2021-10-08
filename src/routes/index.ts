import { Router } from 'express'

import { GetInvasionsShapeController } from '../services/getInvasionsShape/GetInvasionsShapeController'
import { GetRequirementsPhaseController } from '../services/getRequirementsPhase/GetRequirementsPhaseController'
import { GetReservesPhaseController } from '../services/getReservesPhase/GetReservesPhaseController'
import { GetStatisticsController } from '../services/getStatistics/GetStatisticsController'
import { GetYearsController } from '../services/getYears/GetYearsController'
import { InvasionRankingController } from '../services/invasionRanking/InvasionRankingController'
import { ListInvasionsController } from '../services/listInvasions/ListInvasionsController'
import { SearchController } from '../services/search/SearchController'

const router = Router()

const searchController = new SearchController()
const listInvasionsController = new ListInvasionsController()
const invasionRankingController = new InvasionRankingController()
const getStatisticsController = new GetStatisticsController()
const getReservesPhaseController = new GetReservesPhaseController()
const getRequirementsPhaseController = new GetRequirementsPhaseController()
const getInvasionsShapeController = new GetInvasionsShapeController()
const getYearsController = new GetYearsController()

router.get('/search/:searchTerm', searchController.handle)
router.post('/invasions', listInvasionsController.handle)
router.post(
  '/invasions/ranking/:propertyType/:dataType',
  invasionRankingController.handle
)
router.get('/invasions/phase', getRequirementsPhaseController.handle)
router.get('/invasions/years', getYearsController.handle)
router.post('/invasions/shape', getInvasionsShapeController.handle)
router.post('/statistics', getStatisticsController.handle)
router.get('/reserves/phase', getReservesPhaseController.handle)

export { router }
