/**
 * Infrastructure: Dashboard Repository
 * Репозиторий для общения с API дашборда
 * Использует другие репозитории для агрегации данных
 */

import { userRepository } from './userRepository'
import { topicRepository } from './topicRepository'
import { testRepository } from './testRepository'
import { progressRepository } from './progressRepository'
import type { User } from '../../domain/user'
import type { Topic } from '../../domain/topic'
import type { Test } from '../../domain/test'
import type { TestAttempt } from '../../domain/progress'
import type {
  SystemStats,
  RecentActivity,
  SystemAlert,
  SystemLog,
  UserActivity,
  SystemPerformance,
} from '../../domain/dashboard'

export const dashboardRepository = {
  getSystemStats: async (): Promise<SystemStats> => {
    const users = await userRepository.getAllUsers()
    const topics = await topicRepository.getTopics()
    const testAttempts = await progressRepository.getTestAttempts()

    let allTests: Test[] = []
    try {
      const testPromises = topics.map((topic) =>
        testRepository.getTestsByTopic(topic.id).catch(() => [])
      )
      const testResults = await Promise.all(testPromises)
      allTests = testResults.flat()
    } catch {
      allTests = []
    }

    const activeUsers = users.filter((user) => {
      if (!user.last_login) return false
      const lastLogin = new Date(user.last_login)
      const now = new Date()
      const diffHours = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60)
      return diffHours <= 24
    })

    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const usersLastMonth = users.filter((user) => {
      const createdAt = new Date(user.created_at)
      return createdAt < lastMonth
    }).length

    const userGrowth =
      usersLastMonth > 0 ? Math.round(((users.length - usersLastMonth) / usersLastMonth) * 100) : 0

    let systemHealth: 'excellent' | 'good' | 'warning' | 'critical' = 'excellent'
    if (activeUsers.length > 100) systemHealth = 'good'
    if (activeUsers.length > 200) systemHealth = 'warning'
    if (activeUsers.length > 300) systemHealth = 'critical'

    return {
      totalUsers: users.length,
      totalTopics: topics.length,
      totalTests: allTests.length,
      activeSessions: activeUsers.length,
      systemHealth,
      lastBackup: new Date(Date.now() - 3600000).toISOString(),
      uptime: '99.9%',
      userGrowth,
      topicGrowth: 0,
      testGrowth: 0,
    }
  },

  getRecentActivity: async (): Promise<RecentActivity[]> => {
    const users = await userRepository.getAllUsers().catch(() => [])
    const testAttempts = await progressRepository.getTestAttempts().catch(() => [])
    const topics = await topicRepository.getTopics().catch(() => [])

    const activities: RecentActivity[] = []

    const recentUsers = users
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)

    recentUsers.forEach((user) => {
      activities.push({
        id: user.id,
        type: 'user_registration',
        user: user.full_name || user.username,
        time: new Date(user.created_at).toLocaleString(),
        status: 'success',
        details: `Новый пользователь: ${user.role}`,
      })
    })

    const completedTests = testAttempts
      .filter((attempt) => attempt.completed_at)
      .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
      .slice(0, 5)

    completedTests.forEach((attempt) => {
      activities.push({
        id: attempt.id,
        type: 'test_completion',
        user: `Студент ${attempt.user_id}`,
        time: new Date(attempt.completed_at!).toLocaleString(),
        status: 'success',
        details: `Тест завершен, результат: ${attempt.score}%`,
      })
    })

    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10)
  },

  getSystemPerformance: async (): Promise<SystemPerformance> => {
    return {
      cpu: Math.floor(Math.random() * 30) + 20,
      memory: Math.floor(Math.random() * 40) + 40,
      disk: Math.floor(Math.random() * 20) + 10,
      network: Math.floor(Math.random() * 15) + 5,
    }
  },
}

