export declare namespace API {
  namespace Malaysia {
    interface Cases {
      date: string
      cases_new?: string
      cluster_import?: string
      cluster_religious?: string
      cluster_community?: string
      cluster_highRisk?: string
      cluster_education?: string
      cluster_detentionCentre?: string
      cluster_workplace?: string
    }

    interface Deaths {
      date: string
      deaths_new: string
    }

    interface Vaccinated {
      date: string
      daily_partial: string
      daily_full: string
      daily: string
      cumul_partial: string
      cumul_full: string
      cumul: string
      pfizer1: string
      pfizer2: string
      sinovac1: string
      sinovac2: string
      astra1: string
      astra2: string
      pending: string
    }

    interface AllKeys extends Cases, Deaths, Vaccinated {}
  }
}

export declare namespace KVCache {
  interface Cases {
    cases: number
    as_of: string
  }

  interface Deaths {
    deaths: number
    as_of: string
  }

  interface Vaccinated {
    total: number
    firstDose: number
    secondDose: number
    as_of: string
  }
}

export interface CachedData<T> {
  daily: T
  weekly: T
  monthly: T
}

export type Interval = 'daily' | 'weekly' | 'monthly'

export interface PerfomanceData<T> {
  perfomanceBetweenInterval: Partial<T>
}
