import { DateTime } from 'luxon'
import { Keys } from 'tiny-request-router'
import { API } from '../types/Data'

export default function <
  T1 extends API.Malaysia.Cases | API.Malaysia.Deaths | API.Malaysia.Vaccinated,
>(
  data: Array<T1>,
  keys: Array<Partial<keyof T1>>,
): {
  daily: Partial<T1>
  weekly: Partial<T1>
  monthly: Partial<T1>
} {
  const now = DateTime.now()
  // Start and end of week date
  const bWeek = now.startOf('week')
  const eWeek = now.endOf('week')

  // Start and end of month date
  const bMonth = now.startOf('month')
  const eMonth = now.endOf('month')

  let daily: Partial<T1> = {}

  let weekly: Partial<T1> = {}

  let monthly: Partial<T1> = {}

  // Get daily data for keys
  keys.forEach((key) => {
    const latest = data[data.length - 1]
    daily[key] = Number(latest![key]) as any
  })

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
    })
  })

  return {
    daily,
    weekly,
    monthly,
  }
}
