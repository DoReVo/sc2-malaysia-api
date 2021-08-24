import CasesMalaysia from './CasesMalaysia'
import CasesRawMalaysia from './CasesRawMalaysia'
import DeathsMalaysia from './DeathsMalaysia'
import DeathsRawMalaysia from './DeathsRawMalaysia'
import VaccinatedMalaysia from './VaccinatedMalaysia'
import VaccinatedRawMalaysia from './VaccinatedRawMalaysia'

export async function startScrape() {
  await Promise.allSettled([
    CasesMalaysia(),
    DeathsMalaysia(),
    VaccinatedMalaysia(),
    CasesRawMalaysia(),
    DeathsRawMalaysia(),
    VaccinatedRawMalaysia(),
  ])
}
