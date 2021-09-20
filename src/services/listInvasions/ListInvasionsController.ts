import { Request, Response } from 'express'
import json2csv from 'json2csv'
import { container } from 'tsyringe'

import { paginate } from '../../utils/pagination'
import { ListInvasionsService } from './ListInvasionsService'

class ListInvasionsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { filters, enableUnity, enableReserve } = request.body
    const { page, pageSize, output } = request.query

    const listInvasionsService = container.resolve(ListInvasionsService)

    const invasions = await listInvasionsService.execute(
      filters,
      enableUnity,
      enableReserve
    )

    if (output === 'csv') {
      const data = json2csv.parse(invasions)
      return response.attachment('invasions.csv').status(200).send(data)
    }

    const pageNumber = Number(page) || 1
    const pageSizeNumber = Number(pageSize) || 10

    const paginatedInvasions = paginate(invasions, pageNumber, pageSizeNumber)

    return response.json(paginatedInvasions)
  }
}

export { ListInvasionsController }
