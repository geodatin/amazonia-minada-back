import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { GetReservesPhaseService } from './GetReservesPhaseService'

class GetReservesPhaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const getReservesPhaseService = container.resolve(GetReservesPhaseService)

    const homologationPhases = await getReservesPhaseService.execute()

    return response.json(homologationPhases)
  }
}

export { GetReservesPhaseController }
