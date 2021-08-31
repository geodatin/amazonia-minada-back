import { container } from 'tsyringe'

import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { InvasionRepository } from '../../repositories/implementations/InvasionRepository'
import { ReserveInvasionRepository } from '../../repositories/implementations/ReserveInvasionRepository'
import { UnityRepository } from '../../repositories/implementations/UnityRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'
import { IUnityRepository } from '../../repositories/IUnityRepository'

container.registerSingleton<IReserveInvasionRepository>(
  'ReserveInvasionRepository',
  ReserveInvasionRepository
)

container.registerSingleton<IInvasionRepository>(
  'InvasionRepository',
  InvasionRepository
)

container.registerSingleton<IUnityRepository>(
  'UnityRepository',
  UnityRepository
)
