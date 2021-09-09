import { IPaginationDTO } from '../dtos/IPaginationDTO'

export function paginate(
  values: any[],
  page: number,
  pageSize: number
): IPaginationDTO {
  const arraySize = values.length
  const pages = Math.ceil(arraySize / pageSize)
  const offset = (page - 1) * pageSize

  const pageValues = values.slice(offset, offset + pageSize)
  return { values: pageValues, pages, results: arraySize }
}
