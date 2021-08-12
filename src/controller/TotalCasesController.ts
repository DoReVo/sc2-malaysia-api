import { DateTime } from 'luxon'
import papa from 'papaparse'
import { Params } from 'tiny-request-router'
import { corsHeaders } from '../config/CORS'
import { ALLOWED_INTERVAL, TOTAL_POSITIVE_URL } from '../Constant'

interface ParsedCsv {
  data: Datum[]
  errors: Error[]
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

interface Error {
  type: string
  code: string
  message: string
  row: number
}

interface Datum {
  date: string
  cases_new?: string
  cluster_import?: string
  cluster_religious?: string
  cluster_community?: string
  cluster_highRisk?: string
  cluster_education?: string
  cluster_detentionCentre?: string
  cluster_workplace?: string
}

export default async function (request: Request, qs: Params) {
  const { interval } = qs

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
      headers: {
        ...corsHeaders,
      },
    })
  }

  try {
    // Get all positive cases
    const res = await fetch(TOTAL_POSITIVE_URL, {
      method: 'GET',
      headers: {
        Accept: 'text/plain',
      },
    })
    // convert to csv text
    const textData = await res.text()
    // Parsed csv text into json
    const { data }: ParsedCsv = papa.parse(textData, {
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

    // Daily cases
    if (interval === 'daily') {
      const latest = data.pop()
      responseData = { cases: Number(latest?.cases_new) }
    }
    // Weekly cases
    else if (interval === 'weekly') {
      const totalWeek = data.reduce((acc, day): number => {
        const date = DateTime.fromISO(day.date)
        if (date <= eWeek && date >= bWeek) {
          return (acc + Number(day!.cases_new!)) as unknown as number
        }

        return acc
      }, 0)

      responseData = { cases: totalWeek }
    }
    // Monthly cases
    else if (interval === 'monthly') {
      const totalMonth = data.reduce((acc, day): number => {
        const date = DateTime.fromISO(day.date)
        if (date <= eMonth && date >= bMonth) {
          return (acc + Number(day!.cases_new!)) as unknown as number
        }

        return acc
      }, 0)

      responseData = { cases: totalMonth }
    }

    return new Response(JSON.stringify({ ...responseData }), {
      headers: {
        ...corsHeaders,
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        ...corsHeaders,
      },
    })
  }
}
