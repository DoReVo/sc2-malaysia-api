import { Method } from 'tiny-request-router'
import router from './router'

addEventListener('fetch', (event) => {
  const { pathname } = new URL(event.request.url)

  // Route the request using tiny-request-router
  const matchedRoute = router.match(event.request.method as Method, pathname)

  // Call the handler if request matched with routes we specified using
  // tiny-request-router
  if (matchedRoute) event.respondWith(matchedRoute.handler(event.request))
  else event.respondWith(notFoundException())
})

async function notFoundException(): Promise<Response> {
  const init: ResponseInit = {
    status: 404,
  }

  return new Response(JSON.stringify({ error: 'Page not found' }), init)
}
