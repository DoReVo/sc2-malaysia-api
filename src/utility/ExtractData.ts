import { DateTime } from 'luxon'
import { Keys } from 'tiny-request-router'
import { API, PerfomanceData } from '../types/Data'

export default function <
  T1 extends API.Malaysia.Cases | API.Malaysia.Deaths | API.Malaysia.Vaccinated,
>(
  data: Array<T1>,
  keys: Array<Partial<keyof T1>>,
): {
  daily: Partial<T1> & PerfomanceData<T1>
  weekly: Partial<T1> & PerfomanceData<T1>
  monthly: Partial<T1> & PerfomanceData<T1>
} {
  const now = DateTime.now()
  // Start and end of week date
  const bWeek = now.startOf('week')
  const eWeek = now.endOf('week')

  const latest = data[data.length - 1]

  // Range of days to calculate for weekly performance, for example if
  // today is wednesday, we want data from the beginning of last week (monday),
  // until wednesday<upperLimit>. upperLimit will depend on the latest data
  // available, if the latest data's day is thursday, the upperLimit will be
  // thursday
  const bLastWeek = now.minus({ week: 1 }).startOf('week')
  const eLastWeek = DateTime.fromISO(latest!.date).minus({ week: 1 })

  // Start and end of month date
  const bMonth = now.startOf('month')
  const eMonth = now.endOf('month')

  // Range of days to calculate for monthly perfomance, for example if
  // today is the 20th day of the month, we want data of last month, from
  // the 1st day to 20th<upperLimit> day of the month. The upperLimit will
  // depend on the latest data, if today is 20th but the data is not available,
  // then the latest will be whatever latest data there is, usually its 1 day late
  // at most
  const bLastMonth = now.minus({ month: 1 }).startOf('month')
  const eLastMonth = DateTime.fromISO(latest!.date).minus({ month: 1 })

  let daily: Partial<T1> & PerfomanceData<T1> = {} as any

  let weekly: Partial<T1> & PerfomanceData<T1> = {} as any

  let monthly: Partial<T1> & PerfomanceData<T1> = {} as any

  // Get daily data for keys
  keys.forEach((key) => {
    const latest = data[data.length - 1]
    daily[key] = Number(latest![key]) as any
    // Get perfomance of today as compared to yesterday
    // Today<T>'s value - yesterday<Y>'s, if its a positive integer, meaning
    // today is an increase. Negative means today is a decrease.
    // T=120,Y=100 = 20%
    const yesterday = data[data.length - 2]
    const perfomance = Number(
      (
        ((Number(latest[key]) - Number(yesterday[key])) /
          Number(yesterday[key])) *
        100
      ).toFixed(2),
    )
    // Initialized key if its undefined
    if (daily.perfomanceBetweenInterval === undefined)
      daily.perfomanceBetweenInterval = {}

    daily.perfomanceBetweenInterval[key] = perfomance as any
  })

  let lastWeekData: Partial<T1> = {}
  let lastMonthData: Partial<T1> = {}

  // Loop through each row of the data
  data.forEach((day) => {
    // Parse data into luxon object
    const date = DateTime.fromISO(day!.date!)

    // Loop through each keys provided,
    // To find weekly / monthly data about that key.
    // For example if key is cases_new, find the weekly/monthly
    // amount for cases_new
    keys.forEach((key) => {
      // If that row falls within this week
      if (date <= eWeek && date >= bWeek) {
        // Initialized key and object if undefined
        if (weekly[key] === undefined) weekly[key] = 0 as any

        weekly[key] += Number(day[key]) as any
      }
      // If that row falls within this month
      if (date <= eMonth && date >= bMonth) {
        // Initialized key and object if undefined
        if (monthly[key] === undefined) monthly[key] = 0 as any
        monthly[key] += Number(day[key]) as any
      }

      // Performance calculation stuff
      /* ---------------------------- */
      if (date <= eLastWeek && date >= bLastWeek) {
        if (lastWeekData[key] === undefined) lastWeekData[key] = 0 as any
        lastWeekData[key] += Number(day[key]) as any
      }

      if (date <= eLastMonth && date >= bLastMonth) {
        if (lastMonthData[key] === undefined) lastMonthData[key] = 0 as any

        lastMonthData[key] += Number(day[key]) as any
      }
    })
  })

  // Calculate performance percentage differences of
  // each key provided
  keys.forEach((key) => {
    const weeklyPerfomance = Number(
      (
        ((Number(weekly[key]) - Number(lastWeekData[key])) /
          Number(lastWeekData[key])) *
        100
      ).toFixed(2),
    )

    const monthlyPerfomance = Number(
      (
        ((Number(monthly[key]) - Number(lastMonthData[key])) /
          Number(lastMonthData[key])) *
        100
      ).toFixed(2),
    )

    if (weekly.perfomanceBetweenInterval === undefined)
      weekly.perfomanceBetweenInterval = {}

    if (monthly.perfomanceBetweenInterval === undefined)
      monthly.perfomanceBetweenInterval = {}

    weekly.perfomanceBetweenInterval[key] = weeklyPerfomance as any
    monthly.perfomanceBetweenInterval[key] = monthlyPerfomance as any
  })

  return {
    daily,
    weekly,
    monthly,
  }
}
