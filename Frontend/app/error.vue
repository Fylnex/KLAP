<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

const handleError = () => clearError({ redirect: '/' })

const imageError = ref(false)

const handleImageError = () => {
  imageError.value = true
  console.error('Failed to load 404.png image')
}
</script>

<template>
  <UApp>
    <div class="error-page">
      <img 
        v-if="!imageError"
        src="/404.png" 
        alt="404 Page Not Found" 
        class="error-image"
        @error="handleImageError"
        @load="imageError = false"
        loading="eager"
      />
      <div v-else class="error-fallback">
        <h1 class="error-code">404</h1>
        <p class="error-message">Страница не найдена</p>
      </div>
      <div class="error-overlay">
        <button 
          @click="handleError" 
          class="back-button"
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  </UApp>
</template>

<style scoped>
.error-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.error-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.error-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.error-code {
  font-size: 8rem;
  font-weight: bold;
  color: #1b1718;
  margin: 0;
  line-height: 1;
}

.error-message {
  font-size: 1.5rem;
  color: #666;
  margin: 0;
}

.error-overlay {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.back-button {
  padding: 12px 24px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid #1b1718;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1b1718;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #1b1718;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
