/**
 * Infrastructure layer - экспорт всех репозиториев
 * Здесь находятся репозитории для общения с бэкенд API
 */

export * from './httpClient'
export { authRepository } from './repositories/authRepository'
export { userRepository } from './repositories/userRepository'
export { groupRepository } from './repositories/groupRepository'
export { topicRepository } from './repositories/topicRepository'
export { sectionRepository } from './repositories/sectionRepository'
export { questionRepository } from './repositories/questionRepository'
export { questionBankRepository } from './repositories/questionBankRepository'
export { testRepository } from './repositories/testRepository'
export { progressRepository } from './repositories/progressRepository'
export { fileRepository } from './repositories/fileRepository'
export { profileRepository } from './repositories/profileRepository'
export { dashboardRepository } from './repositories/dashboardRepository'

