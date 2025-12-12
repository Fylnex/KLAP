/**
 * Domain: Dashboard - модели для дашборда
 */

export interface SystemStats {
  totalUsers: number
  totalTopics: number
  totalTests: number
  activeSessions: number
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical'
  lastBackup: string
  uptime: string
  userGrowth: number
  topicGrowth: number
  testGrowth: number
}

export interface RecentActivity {
  id: number
  type: 'user_registration' | 'test_completion' | 'system_backup' | 'error_log' | 'topic_created' | 'test_created'
  user: string
  time: string
  status: 'success' | 'warning' | 'error'
  details?: string
}

export interface SystemAlert {
  id: number
  type: 'warning' | 'info' | 'error'
  message: string
  time: string
  severity: 'low' | 'medium' | 'high'
}

export interface SystemLog {
  id: number
  user: string
  action: string
  target: string
  date: string
  type: 'create' | 'delete' | 'update' | 'archive' | 'complete' | 'login' | 'logout'
}

export interface UserActivity {
  onlineNow: number
  today: number
  thisWeek: number
  thisMonth: number
}

export interface SystemPerformance {
  cpu: number
  memory: number
  disk: number
  network: number
}

