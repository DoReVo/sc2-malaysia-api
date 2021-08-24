import { parse, ParseResult } from 'papaparse'
import FetchConfig from '../config/Fetch'
import PapaParseConfig from '../config/PapaParse'
import { DEATHS_MALAYSIA_URL } from '../Constant'
import { API } from '../types/Data'

export default async (
  returnData: boolean = false,
): Promise<Partial<API.Malaysia.Deaths>[] | void> => {
  // Get deaths in malaysia
  const res = await fetch(DEATHS_MALAYSIA_URL, FetchConfig)
  // convert to csv text
  const textData = await res.text()
  // Parsed csv text into json
  const { data }: ParseResult<API.Malaysia.Deaths> = parse(
    textData,
    PapaParseConfig,
  )

  const filteredDeaths: Partial<API.Malaysia.Deaths>[] = data.map(
    (deathCase) => {
      return { date: deathCase.date, deaths_new: deathCase.deaths_new }
    },
  )

  await SC2.put('raw_deaths', JSON.stringify(filteredDeaths))

  if (returnData) return filteredDeaths
}
