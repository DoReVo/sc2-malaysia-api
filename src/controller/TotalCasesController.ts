import papa from 'papaparse'
import { TOTAL_POSITIVE_URL } from '../Constant'

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

export default async function () {
  const res = await fetch(TOTAL_POSITIVE_URL, {
    method: 'GET',
    headers: {
      Accept: 'text/plain',
    },
  })

  const textData = await res.text()

  const { data }: ParsedCsv = papa.parse(textData, {
    header: true,
    skipEmptyLines: true,
  }) as unknown as ParsedCsv

  const transformedData = data!.map((row) => {
    return { date: row.date, cases: row.cases_new }
  })

  return new Response(JSON.stringify(transformedData))
}
