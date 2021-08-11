import { Params, Router } from 'tiny-request-router'
import DeathController from './controller/DeathController'

import { handleOptionsPreflight } from './controller/PreFlightController'
import TotalMalaysiaController from './controller/TotalMalaysiaController'
import { Handler } from './types'

const router = new Router<Handler>()

router.get('/', async () => {
  return new Response('SC2-Malaysia API')
})

router.get('/total', TotalMalaysiaController)
router.get('/death', DeathController)
router.options('*', handleOptionsPreflight)

export default router
