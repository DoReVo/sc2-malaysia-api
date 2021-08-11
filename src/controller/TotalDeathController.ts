import { DateTime } from 'luxon'
import Papa from 'papaparse'
import { ALLOWED_INTERVAL, TOTAL_DEATH_URL } from '../Constant'

interface ParsedCsv {
  data: Datum[]
  errors: any[]
  meta: Meta
}

interface Meta {
  delimiter: string
  linebreak: string
  aborted: boolean
  truncated: boolean
  cursor: number
  fields: string[]
}

interface Datum {
  date: string
  deaths_new: string
}

export default async function (request: Request) {
  let params
  // Try to parse body
  try {
    const textData = await request.text()
    params = JSON.parse(textData)
  } catch (error) {
    console.log('Request have no data')
  }

  const { interval } = params

  // Check for valid interval
  try {
    // return error if there is no interval param
    if (!interval) throw new Error('Interval is required')
    // Check if interval is 1 of the following
    const isAllowed = ALLOWED_INTERVAL.some((i) => i === interval)
    // Return error if interval not allowed
    if (!isAllowed)
      throw new Error('Interval must be either daily, weekly or monthly')
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 422,
    })
  }

  try {
    const res = await fetch(TOTAL_DEATH_URL, {
      method: 'GET',
      headers: {
        Accept: 'text/plain',
      },
    })

    const textData = await res.text()

    const { data } = Papa.parse(textData, {
      header: true,
      skipEmptyLines: true,
    }) as unknown as ParsedCsv

    let responseData

    const now = DateTime.now()
    // Start and end of week date
    const bWeek = now.startOf('week')
    const eWeek = now.endOf('week')

    // Start and end of month date
    const bMonth = now.startOf('month')
    const eMonth = now.endOf('month')

    // Daily deaths
    if (interval === 'daily') {
      const latest = data.pop()
      responseData = { deaths: Number(latest?.deaths_new) }
    }
    // Weekly deaths
    else if (interval === 'weekly') {
      const totalWeek = data.reduce((acc, day): number => {
        const date = DateTime.fromISO(day.date)
        if (date <= eWeek && date >= bWeek) {
          return (acc + Number(day!.deaths_new!)) as unknown as number
        }

        return acc
      }, 0)

      responseData = { deaths: totalWeek }
    }
    // Monthly deaths
    else if (interval === 'monthly') {
      const totalMonth = data.reduce((acc, day): number => {
        const date = DateTime.fromISO(day.date)
        if (date <= eMonth && date >= bMonth) {
          return (acc + Number(day!.deaths_new!)) as unknown as number
        }

        return acc
      }, 0)

      responseData = { deaths: totalMonth }
    }

    return new Response(JSON.stringify({ ...responseData }))
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    })
  }
}
