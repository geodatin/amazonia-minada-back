import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { SearchService } from './SearchService'

class SearchController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { searchTerm } = request.params

    const searchService = container.resolve(SearchService)

    const results = await searchService.execute(String(searchTerm))

    return response.json(results)
  }
}

export { SearchController }
