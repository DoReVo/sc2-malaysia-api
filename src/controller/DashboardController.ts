import { Params } from 'tiny-request-router'
import { corsHeaders } from '../config/CORS'
import CasesMalaysia from '../cron/CasesMalaysia'
import DeathsMalaysia from '../cron/DeathsMalaysia'
import VaccinatedMalaysia from '../cron/VaccinatedMalaysia'
import { CachedData, KVCache } from '../types/Data'

export default async function (_: Request, __: Params) {
  try {
    let cases: CachedData<KVCache.Cases> | null = await SC2.get('cases', 'json')
    let deaths: CachedData<KVCache.Deaths> | null = await SC2.get(
      'deaths',
      'json',
    )
    let vaccinated: CachedData<KVCache.Vaccinated> | null = await SC2.get(
      'vaccinated',
      'json',
    )

    if (!cases) cases = (await CasesMalaysia(true)) as CachedData<KVCache.Cases>

    if (!deaths)
      deaths = (await DeathsMalaysia(true)) as CachedData<KVCache.Deaths>

    if (!vaccinated)
      vaccinated = (await VaccinatedMalaysia(
        true,
      )) as CachedData<KVCache.Vaccinated>

    const responseData = { cases, deaths, vaccinated }

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
