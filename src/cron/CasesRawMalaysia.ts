import { parse, ParseResult } from 'papaparse'
import FetchConfig from '../config/Fetch'
import PapaParseConfig from '../config/PapaParse'
import { CASES_MALAYSIA_URL } from '../Constant'
import { API } from '../types/Data'

export default async (
  returnData: boolean = false,
): Promise<Partial<API.Malaysia.Cases>[] | void> => {
  // Get cases in malaysia
  const res = await fetch(CASES_MALAYSIA_URL, FetchConfig)
  // convert to csv text
  const textData = await res.text()
  // Parsed csv text into json
  const { data }: ParseResult<API.Malaysia.Cases> = parse(
    textData,
    PapaParseConfig,
  )

  const filteredCase: Partial<API.Malaysia.Cases>[] = data.map(
    (positiveCase) => {
      return { date: positiveCase.date, cases_new: positiveCase.cases_new! }
    },
  )

  await SC2.put('raw_cases', JSON.stringify(filteredCase))

  if (returnData) return filteredCase
}
