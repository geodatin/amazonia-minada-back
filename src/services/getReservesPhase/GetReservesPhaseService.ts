import { inject, injectable } from 'tsyringe'

import { ISearchDTO } from '../../dtos/ISearchDTO'
import { IReserveRepository } from '../../repositories/IReserveRepository'

@injectable()
class GetReservesPhaseService {
  constructor(
    @inject('ReserveRepository')
    private reserveRepository: IReserveRepository
  ) {}

  async execute(): Promise<ISearchDTO[]> {
    const homologationPhases =
      await this.reserveRepository.getHomologationPhases()

    return homologationPhases
  }
}

export { GetReservesPhaseService }
