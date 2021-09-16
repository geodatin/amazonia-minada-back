import { ISearchDTO } from '../dtos/ISearchDTO'

interface ILicenseRepository {
  searchSubstance(searchTerm: string): Promise<ISearchDTO[]>
}

export { ILicenseRepository }
