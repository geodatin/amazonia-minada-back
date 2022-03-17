type filterOptions = {
  [key: string]: string
}

const rankingFilter: filterOptions = {
  state: '$state',
  reserve: '$reserve',
  unity: '$unity',
  company: '$company',
  substance: '$substance',
  requirementPhase: '$requirementPhase',
  use: '$use',
}

export { rankingFilter }
