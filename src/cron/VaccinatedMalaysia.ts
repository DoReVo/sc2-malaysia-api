import { parse, ParseResult } from 'papaparse'
import FetchConfig from '../config/Fetch'
import PapaParseConfig from '../config/PapaParse'
import { VACCINATED_MALAYSIA_URL } from '../Constant'
import { API, CachedData, KVCache, PerfomanceData } from '../types/Data'
import ExtractData from '../utility/ExtractData'

export default async (
  returnData: boolean = false,
): Promise<CachedData<KVCache.Vaccinated> | void> => {
  // Get vaccinated total
  const res = await fetch(VACCINATED_MALAYSIA_URL, FetchConfig)
  // convert to csv text
  const textData = await res.text()
  // Parsed csv text into json
  const { data }: ParseResult<API.Malaysia.Vaccinated> = parse(
    textData,
    PapaParseConfig,
  )

  const { daily, weekly, monthly } = ExtractData<API.Malaysia.Vaccinated>(
    data,
    ['daily', 'daily_partial', 'daily_full'],
  )

  const dailyData: KVCache.Vaccinated & PerfomanceData<KVCache.Vaccinated> = {
    total: Number(daily.daily ? daily.daily : 0),
    firstDose: Number(daily.daily_partial ? daily.daily_partial : 0),
    secondDose: Number(daily.daily_full ? daily.daily_full : 0),
    as_of: data[data.length - 1].date,
    perfomanceBetweenInterval: {
      total: daily?.perfomanceBetweenInterval?.daily ?? (null as any),
      firstDose:
        daily?.perfomanceBetweenInterval?.daily_partial ?? (null as any),
      secondDose: daily?.perfomanceBetweenInterval?.daily_full ?? (null as any),
    },
  }
  const weeklyData: KVCache.Vaccinated & PerfomanceData<KVCache.Vaccinated> = {
    total: Number(weekly.daily ? weekly.daily : 0),
    firstDose: Number(weekly.daily_partial ? weekly.daily_partial : 0),
    secondDose: Number(weekly.daily_full ? weekly.daily_full : 0),
    as_of: data[data.length - 1].date,
    perfomanceBetweenInterval: {
      total: weekly?.perfomanceBetweenInterval?.daily ?? (null as any),
      firstDose:
        weekly?.perfomanceBetweenInterval?.daily_partial ?? (null as any),
      secondDose:
        weekly?.perfomanceBetweenInterval?.daily_full ?? (null as any),
    },
  }
  const monthlyData: KVCache.Vaccinated & PerfomanceData<KVCache.Vaccinated> = {
    total: Number(monthly.daily ? monthly.daily : 0),
    firstDose: Number(monthly.daily_partial ? monthly.daily_partial : 0),
    secondDose: Number(monthly.daily_full ? monthly.daily_full : 0),
    as_of: data[data.length - 1].date,
    perfomanceBetweenInterval: {
      total: monthly?.perfomanceBetweenInterval?.daily ?? (null as any),
      firstDose:
        monthly?.perfomanceBetweenInterval?.daily_partial ?? (null as any),
      secondDose:
        monthly?.perfomanceBetweenInterval?.daily_full ?? (null as any),
    },
  }

  const vaccinated: CachedData<KVCache.Vaccinated> = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData,
  }

  await SC2.put('vaccinated', JSON.stringify(vaccinated))

  if (returnData) return vaccinated
}
