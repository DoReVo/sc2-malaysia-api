import { Params } from 'tiny-request-router'
import { corsHeaders } from '../config/CORS'
import CasesRawMalaysia from '../cron/CasesRawMalaysia'
import DeathsRawMalaysia from '../cron/DeathsRawMalaysia'
import VaccinatedRawMalaysia from '../cron/VaccinatedRawMalaysia'
import { API } from '../types/Data'

export default async function (_: Request, __: Params) {
  try {
    let rawCases: Partial<API.Malaysia.Cases> | null = await SC2.get(
      'raw_cases',
      'json',
    )
    let rawDeaths: Partial<API.Malaysia.Deaths> | null = await SC2.get(
      'raw_deaths',
      'json',
    )
    let rawVaccinated: Partial<API.Malaysia.Vaccinated> | null = await SC2.get(
      'raw_vaccinated',
      'json',
    )

    if (!rawCases)
      rawCases = (await CasesRawMalaysia(true)) as Partial<API.Malaysia.Cases>

    if (!rawDeaths)
      rawDeaths = (await DeathsRawMalaysia(
        true,
      )) as Partial<API.Malaysia.Deaths>

    if (!rawVaccinated)
      rawVaccinated = (await VaccinatedRawMalaysia(
        true,
      )) as Partial<API.Malaysia.Vaccinated>

    const responseData = { rawCases, rawDeaths, rawVaccinated }

    return new Response(JSON.stringify(responseData), {
      status: 200,
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
