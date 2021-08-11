import Papa from 'papaparse'
import { TOTAL_DEATH_URL } from '../Constant'

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

export default async function () {
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

  return new Response(JSON.stringify(data))
}
