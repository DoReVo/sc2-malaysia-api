import FetchConfig from '../config/Fetch'
import { CASES_MALAYSIA_URL } from '../Constant'
import { parse, ParseResult } from 'papaparse'
import PapaParseConfig from '../config/PapaParse'
import { API, CachedData, KVCache, PerfomanceData } from '../types/Data'
import ExtractData from '../utility/ExtractData'

export default async (
  returnData: boolean = false,
): Promise<CachedData<KVCache.Cases> | void> => {
  // Get cases in malaysia
  const res = await fetch(CASES_MALAYSIA_URL, FetchConfig)

  // convert to csv text
  const textData = await res.text()
  // Parsed csv text into json
  const { data }: ParseResult<API.Malaysia.Cases> = parse(
    textData,
    PapaParseConfig,
  )

  const { daily, weekly, monthly } = ExtractData<API.Malaysia.Cases>(data, [
    'cases_new',
  ])

  // Daily Cases data
  const dailyData: KVCache.Cases & PerfomanceData<KVCache.Cases> = {
    cases: Number(daily.cases_new ? daily.cases_new : 0),
    as_of: data[data.length - 1]!.date,
    perfomanceBetweenInterval: {
      cases: daily?.perfomanceBetweenInterval?.cases_new ?? (null as any),
    },
  }

  const weeklyData: KVCache.Cases & PerfomanceData<KVCache.Cases> = {
    cases: Number(weekly.cases_new ? weekly.cases_new : 0),
    as_of: data[data.length - 1]!.date,
    perfomanceBetweenInterval: {
      cases: weekly?.perfomanceBetweenInterval?.cases_new ?? (null as any),
    },
  }

  const monthlyData: KVCache.Cases & PerfomanceData<KVCache.Cases> = {
    cases: Number(monthly.cases_new ? monthly.cases_new : 0),
    as_of: data[data.length - 1]!.date,
    perfomanceBetweenInterval: {
      cases: monthly?.perfomanceBetweenInterval?.cases_new ?? (null as any),
    },
  }

  const cases: CachedData<KVCache.Cases> = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData,
  }

  await SC2.put('cases', JSON.stringify(cases))

  if (returnData) return cases
}
