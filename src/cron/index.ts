import CasesMalaysia from './CasesMalaysia'
import DeathsMalaysia from './DeathsMalaysia'
import VaccinatedMalaysia from './VaccinatedMalaysia'

export async function startScrape() {
  await Promise.allSettled([
    CasesMalaysia(),
    DeathsMalaysia(),
    VaccinatedMalaysia(),
  ])
}
