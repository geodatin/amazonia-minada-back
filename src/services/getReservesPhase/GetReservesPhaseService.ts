import { inject, injectable } from 'tsyringe'

import { IReserveRepository } from '../../repositories/IReserveRepository'

@injectable()
class GetReservesPhaseService {
  constructor(
    @inject('ReserveRepository')
    private reserveRepository: IReserveRepository
  ) {}

  async execute(): Promise<String[]> {
    const homologationPhases =
      await this.reserveRepository.getHomologationPhases()

    return homologationPhases
  }
}

export { GetReservesPhaseService }
