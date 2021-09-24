import * as yup from 'yup'

const filterSchema = yup
  .object()
  .shape({
    state: yup.array().of(yup.string()),
    reserve: yup.array().of(yup.string()),
    unity: yup.array().of(yup.string()),
    company: yup.array().of(yup.string()),
    year: yup.array().of(yup.number()),
    substance: yup.array().of(yup.string()),
    requirementPhase: yup.array().of(yup.string()),
    reservePhase: yup.array().of(yup.string()),
    reserveEthnicity: yup.array().of(yup.string()),
  })
  .noUnknown(true)
  .strict()
export { filterSchema }
