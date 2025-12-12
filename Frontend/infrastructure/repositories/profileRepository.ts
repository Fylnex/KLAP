/**
 * Infrastructure: Profile Repository
 * Репозиторий для общения с API профиля
 */

import { getHttpClient } from '../httpClient'
import type { Profile } from '../../domain/progress'

export const profileRepository = {
  getProfile: async (): Promise<Profile> => {
    const http = getHttpClient()
    const { data } = await http.get<Profile>('/profile')
    return data
  },
}

