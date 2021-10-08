import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { GetRequirementsPhaseService } from './GetRequirementsPhaseService'

class GetRequirementsPhaseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const getRequirementsPhaseService = container.resolve(
      GetRequirementsPhaseService
    )
    const requirementsPhase = await getRequirementsPhaseService.execute()

    return response.json(requirementsPhase)
  }
}

export { GetRequirementsPhaseController }
