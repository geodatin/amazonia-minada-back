import { inject, injectable } from 'tsyringe'

import { ISearchDTO } from '../../dtos/ISearchDTO'
import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'
import { groupResults } from '../../utils/group'

@injectable()
class GetRequirementsPhaseService {
  constructor(
    @inject('ReserveInvasionRepository')
    private reserveInvasionRepository: IReserveInvasionRepository,

    @inject('InvasionRepository')
    private invasionRepository: IInvasionRepository
  ) {}

  async execute(): Promise<ISearchDTO[]> {
    const reserveRequirementsPhase =
      await this.reserveInvasionRepository.getRequirementsPhase()

    const unityRequirementsPhase =
      await this.invasionRepository.getRequirementsPhase()

    const requirementsPhase = groupResults(
      reserveRequirementsPhase,
      unityRequirementsPhase
    )

    const requirementsPhaseArray = Array.from(requirementsPhase).filter(
      (phase) => phase.value !== 'DADO NÃO CADASTRADO'
    )

    return requirementsPhaseArray
  }
}

export { GetRequirementsPhaseService }
