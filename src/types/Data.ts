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
      dose1_daily: string
      dose2_daily: string
      total_daily: string
      dose1_cumul: string
      dose2_cumul: string
      total_cumul: string
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
