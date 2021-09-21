import { inject, injectable } from 'tsyringe'

import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'

@injectable()
class GetRequirementsPhaseService {
  constructor(
    @inject('ReserveInvasionRepository')
    private reserveInvasionRepository: IReserveInvasionRepository,

    @inject('InvasionRepository')
    private invasionRepository: IInvasionRepository
  ) {}

  async execute(): Promise<String[]> {
    const reserveRequirementsPhase =
      await this.reserveInvasionRepository.getRequirementsPhase()

    const unityRequirementsPhase =
      await this.invasionRepository.getRequirementsPhase()

    const requirementsPhase = new Set([
      ...reserveRequirementsPhase,
      ...unityRequirementsPhase,
    ])

    const requirementsPhaseArray = Array.from(requirementsPhase).filter(
      (phase) => phase !== 'DADO NÃO CADASTRADO'
    )

    return requirementsPhaseArray
  }
}

export { GetRequirementsPhaseService }
