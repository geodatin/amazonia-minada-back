import { container } from 'tsyringe'

import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { InvasionRepository } from '../../repositories/implementations/InvasionRepository'
import { ReserveInvasionRepository } from '../../repositories/implementations/ReserveInvasionRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'

container.registerSingleton<IReserveInvasionRepository>(
  'ReserveInvasionRepository',
  ReserveInvasionRepository
)

container.registerSingleton<IInvasionRepository>(
  'InvasionRepository',
  InvasionRepository
)
