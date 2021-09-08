import { Router } from 'express'

import { InvasionFrequencyController } from '../services/invasionFrequencyRanking/InvasionRankingController'
import { ListInvasionsController } from '../services/listInvasions/ListInvasionsController'
import { SearchController } from '../services/search/SearchController'

const router = Router()

const searchController = new SearchController()
const listInvasionsController = new ListInvasionsController()
const invasionFrequencyController = new InvasionFrequencyController()

router.get('/search/:searchTerm', searchController.handle)
router.post('/invasions', listInvasionsController.handle)
router.get(
  '/invasions/ranking/:territoryType/:dataType',
  invasionFrequencyController.handle
)

export { router }
