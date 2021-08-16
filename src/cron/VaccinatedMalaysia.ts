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
    ['total_daily', 'dose1_daily', 'dose2_daily'],
  )

  const dailyData: KVCache.Vaccinated & PerfomanceData<KVCache.Vaccinated> = {
    total: Number(daily.total_daily ? daily.total_daily : 0),
    firstDose: Number(daily.dose1_daily ? daily.dose1_daily : 0),
    secondDose: Number(daily.dose2_daily ? daily.dose2_daily : 0),
    as_of: data[data.length - 1].date,
    perfomanceBetweenInterval: {
      total: daily?.perfomanceBetweenInterval?.total_daily ?? (null as any),
      firstDose: daily?.perfomanceBetweenInterval?.dose1_daily ?? (null as any),
      secondDose:
        daily?.perfomanceBetweenInterval?.dose2_daily ?? (null as any),
    },
  }
  const weeklyData: KVCache.Vaccinated & PerfomanceData<KVCache.Vaccinated> = {
    total: Number(weekly.total_daily ? weekly.total_daily : 0),
    firstDose: Number(weekly.dose1_daily ? weekly.dose1_daily : 0),
    secondDose: Number(weekly.dose2_daily ? weekly.dose2_daily : 0),
    as_of: data[data.length - 1].date,
    perfomanceBetweenInterval: {
      total: weekly?.perfomanceBetweenInterval?.total_daily ?? (null as any),
      firstDose:
        weekly?.perfomanceBetweenInterval?.dose1_daily ?? (null as any),
      secondDose:
        weekly?.perfomanceBetweenInterval?.dose2_daily ?? (null as any),
    },
  }
  const monthlyData: KVCache.Vaccinated & PerfomanceData<KVCache.Vaccinated> = {
    total: Number(monthly.total_daily ? monthly.total_daily : 0),
    firstDose: Number(monthly.dose1_daily ? monthly.dose1_daily : 0),
    secondDose: Number(monthly.dose2_daily ? monthly.dose2_daily : 0),
    as_of: data[data.length - 1].date,
    perfomanceBetweenInterval: {
      total: monthly?.perfomanceBetweenInterval?.total_daily ?? (null as any),
      firstDose:
        monthly?.perfomanceBetweenInterval?.dose1_daily ?? (null as any),
      secondDose:
        monthly?.perfomanceBetweenInterval?.dose2_daily ?? (null as any),
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
