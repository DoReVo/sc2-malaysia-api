import { parse, ParseResult } from 'papaparse'
import FetchConfig from '../config/Fetch'
import PapaParseConfig from '../config/PapaParse'
import { VACCINATED_MALAYSIA_URL } from '../Constant'
import { API } from '../types/Data'

export default async (
  returnData: boolean = false,
): Promise<Partial<API.Malaysia.Vaccinated>[] | void> => {
  // Get deaths in malaysia
  const res = await fetch(VACCINATED_MALAYSIA_URL, FetchConfig)
  // convert to csv text
  const textData = await res.text()
  // Parsed csv text into json
  const { data }: ParseResult<API.Malaysia.Vaccinated> = parse(
    textData,
    PapaParseConfig,
  )

  const filteredVaccinated: Partial<API.Malaysia.Vaccinated>[] = data.map(
    (vaccinated) => {
      return {
        date: vaccinated.date,
        total: vaccinated.daily,
        firstDose: vaccinated.daily_partial,
        secondDose: vaccinated.daily_full,
      }
    },
  )

  await SC2.put('raw_vaccinated', JSON.stringify(filteredVaccinated))

  if (returnData) return filteredVaccinated
}
