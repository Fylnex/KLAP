/**
 * Composable для работы с тестами
 * Объединяет Application и Infrastructure слои
 */

import { testRepository } from '../../infrastructure'
import type { Test, TestResult, TestStatus } from '../../domain'

export const useTests = () => {
  const tests = useState<Test[]>('tests.list', () => [])
  const currentTest = useState<Test | null>('tests.current', () => null)
  const testStatus = useState<TestStatus | null>('tests.status', () => null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Получить все тесты
   */
  const fetchTests = async () => {
    isLoading.value = true
    error.value = null

    try {
      const data = await testRepository.getAllTests()
      tests.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки тестов'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Получить тест по ID
   */
  const fetchTest = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await testRepository.getTest(id)
      currentTest.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки теста'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Получить тесты по теме
   */
  const fetchTestsByTopic = async (topicId: number) => {
    isLoading.value = true
    error.value = null

    try {
      const data = await testRepository.getTestsByTopic(topicId)
      return data
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки тестов'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Начать тест
   */
  const startTest = async (testId: number) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await testRepository.startTest(testId)
      return response
    } catch (err: any) {
      error.value = err.message || 'Ошибка начала теста'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Отправить ответы теста
   */
  const submitTest = async (submitData: {
    attempt_id: number
    answers: Array<{
      question_id: number
      answer: string | number | Array<string | number> | null
    }>
    time_spent: number
  }) => {
    isLoading.value = true
    error.value = null

    try {
      const result = await testRepository.submitTest(submitData)
      return result
    } catch (err: any) {
      error.value = err.message || 'Ошибка отправки теста'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Получить статус теста
   */
  const fetchTestStatus = async (testId: number) => {
    isLoading.value = true
    error.value = null

    try {
      const status = await testRepository.getTestStatus(testId)
      testStatus.value = status
      return status
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки статуса теста'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Получить мои тесты
   */
  const fetchMyTests = async () => {
    isLoading.value = true
    error.value = null

    try {
      const data = await testRepository.getMyTests()
      tests.value = data
      return data
    } catch (err: any) {
      error.value = err.message || 'Ошибка загрузки моих тестов'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    tests: readonly(tests),
    currentTest: readonly(currentTest),
    testStatus: readonly(testStatus),
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Methods
    fetchTests,
    fetchTest,
    fetchTestsByTopic,
    startTest,
    submitTest,
    fetchTestStatus,
    fetchMyTests,
  }
}

