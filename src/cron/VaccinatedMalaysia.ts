import { parse, ParseResult } from 'papaparse'
import FetchConfig from '../config/Fetch'
import PapaParseConfig from '../config/PapaParse'
import { VACCINATED_MALAYSIA_URL } from '../Constant'
import { API, CachedData, KVCache } from '../types/Data'
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

  const dailyData: KVCache.Vaccinated = {
    total: Number(daily.total_daily),
    firstDose: Number(daily.dose1_daily),
    secondDose: Number(daily.dose2_daily),
    as_of: data[data.length - 1].date,
  }
  const weeklyData: KVCache.Vaccinated = {
    total: Number(weekly.total_daily),
    firstDose: Number(weekly.dose1_daily),
    secondDose: Number(weekly.dose2_daily),
    as_of: data[data.length - 1].date,
  }
  const monthlyData: KVCache.Vaccinated = {
    total: Number(monthly.total_daily),
    firstDose: Number(monthly.dose1_daily),
    secondDose: Number(monthly.dose2_daily),
    as_of: data[data.length - 1].date,
  }

  const vaccinated: CachedData<KVCache.Vaccinated> = {
    daily: dailyData,
    weekly: weeklyData,
    monthly: monthlyData,
  }

  await SC2.put('vaccinated', JSON.stringify(vaccinated))

  if (returnData) return vaccinated
}
