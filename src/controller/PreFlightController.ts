import { corsHeaders } from '../config/CORS'

export async function handleOptionsPreflight(
  request: Request,
): Promise<Response> {
  const { headers } = request

  const allHeadersPresent =
    headers.get('Origin') !== null &&
    headers.get('Access-Control-Request-Method') !== null &&
    headers.get('Access-Control-Request-Headers') !== null

  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  if (allHeadersPresent) {
    let respHeaders = {
      ...corsHeaders,
      'Access-Control-Allow-Headers': headers.get(
        'Access-Control-Request-Headers',
      )!,
    }

    return new Response(null, { headers: respHeaders })
  } else
    return new Response(null, {
      headers: { Allow: 'GET, HEAD, POST, OPTIONS' },
    })
}
