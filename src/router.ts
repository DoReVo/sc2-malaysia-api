import { Router } from 'tiny-request-router'
import DashboardController from './controller/DashboardController'
import GraphsController from './controller/GraphsController'
import { handleOptionsPreflight } from './controller/PreFlightController'
import TotalCasesController from './controller/TotalCasesController'
import TotalDeathController from './controller/TotalDeathController'
import TotalVaccinatedController from './controller/TotalVaccinatedController'
import { Handler } from './types'

const router = new Router<Handler>()

router.get('/', async () => {
  return new Response('SC2-Malaysia API')
})

router.get('/total/:interval', TotalCasesController)
router.get('/death/:interval', TotalDeathController)
router.get('/vaccinated/:interval', TotalVaccinatedController)
router.get('/dashboard', DashboardController)
router.get('/graphs', GraphsController)
router.options('*', handleOptionsPreflight)

export default router
