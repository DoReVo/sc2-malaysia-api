import { parse, ParseResult } from 'papaparse'
import FetchConfig from '../config/Fetch'
import PapaParseConfig from '../config/PapaParse'
import { DEATHS_MALAYSIA_URL } from '../Constant'
import { API, CachedData, KVCache } from '../types/Data'
import ExtractData from '../utility/ExtractData'

export default async (
  returnData: boolean = false,
): Promise<CachedData<KVCache.Deaths> | void> => {
  // Get deaths cases in Malaysia
  const res = await fetch(DEATHS_MALAYSIA_URL, FetchConfig)

  // convert to csv text
  const textData = await res.text()
  // Parsed csv text into json
  const { data }: ParseResult<API.Malaysia.Deaths> = parse(
    textData,
    PapaParseConfig,
  )

  const { daily, weekly, monthly } = ExtractData<API.Malaysia.Deaths>(data, [
    'deaths_new',
  ])

  const dailyData: KVCache.Deaths = {
    deaths: Number(daily.deaths_new ? daily.deaths_new : 0),
    as_of: data[data.length - 1].date,
  }

  const weeklyData: KVCache.Deaths = {
    deaths: Number(weekly.deaths_new ? weekly.deaths_new : 0),
    as_of: data[data.length - 1].date,
  }

  const monthlyData: KVCache.Deaths = {
    deaths: Number(monthly.deaths_new ? monthly.deaths_new : 0),
    as_of: data[data.length - 1].date,
  }

  const deaths: CachedData<KVCache.Deaths> = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData,
  }

  await SC2.put('deaths', JSON.stringify(deaths))

  if (returnData) return deaths
}
