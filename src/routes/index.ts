import { Router } from 'express'

import { SearchController } from '../services/search/SearchController'

const router = Router()

const searchController = new SearchController()

router.get('/search', searchController.handle)

export { router }
