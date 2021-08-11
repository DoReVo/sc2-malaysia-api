import { Router } from 'tiny-request-router'
import { handleOptionsPreflight } from './controller/PreFlightController'
import TotalCasesController from './controller/TotalCasesController'
import TotalDeathController from './controller/TotalDeathController'
import TotalVaccinatedController from './controller/TotalVaccinatedController'
import { Handler } from './types'

const router = new Router<Handler>()

router.get('/', async () => {
  return new Response('SC2-Malaysia API')
})

router.get('/total', TotalCasesController)
router.get('/death', TotalDeathController)
router.get('/vaccinated', TotalVaccinatedController)
router.options('*', handleOptionsPreflight)

export default router
