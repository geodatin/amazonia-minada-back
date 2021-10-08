import { container } from 'tsyringe'

import { IInvasionRepository } from '../../repositories/IInvasionRepository'
import { ILicenseRepository } from '../../repositories/ILicenseRepository'
import { InvasionRepository } from '../../repositories/implementations/InvasionRepository'
import { LicenseRepository } from '../../repositories/implementations/LicenseRepository'
import { ReserveInvasionRepository } from '../../repositories/implementations/ReserveInvasionRepository'
import { ReserveRepository } from '../../repositories/implementations/ReserveRepository'
import { UnityRepository } from '../../repositories/implementations/UnityRepository'
import { IReserveInvasionRepository } from '../../repositories/IReserveInvasionRepository'
import { IReserveRepository } from '../../repositories/IReserveRepository'
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

container.registerSingleton<IReserveRepository>(
  'ReserveRepository',
  ReserveRepository
)

container.registerSingleton<ILicenseRepository>(
  'LicenseRepository',
  LicenseRepository
)
