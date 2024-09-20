import { FuzzyMatch } from './fuzzy-match'
import { SimpleMatch } from './simple-match'
import { InputData } from './type'

const simpleMatch = new SimpleMatch()
const fuzzyMatch = new FuzzyMatch()

export const match = async (input: InputData) => {
  await simpleMatch.match(input)
  await fuzzyMatch.match(input)

  return input
}
