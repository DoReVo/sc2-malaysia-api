import { Params } from 'tiny-request-router'
import { corsHeaders } from '../config/CORS'
import { ALLOWED_INTERVAL } from '../Constant'
import DeathsMalaysia from '../cron/DeathsMalaysia'
import { CachedData, Interval, KVCache } from '../types/Data'

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
    let deaths: CachedData<KVCache.Deaths> | null = await SC2.get(
      'deaths',
      'json',
    )

    if (deaths === null)
      deaths = (await DeathsMalaysia(true)) as CachedData<KVCache.Deaths>

    const intv: Interval = interval as Interval

    return new Response(JSON.stringify(deaths[intv]), {
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
