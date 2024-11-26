<script lang="ts" setup>
import { useTheme } from 'vuetify'
import { useRouter } from 'vue-router'
import { useTodoStore } from '@/stores/todoStore';

const theme = useTheme()
const router = useRouter()
const store = useTodoStore()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  localStorage.setItem('theme', theme.global.name.value)
}
function logout() {
  localStorage.clear()
  store.clearTodos()
  router.push({ name: 'login' })
}
</script>

<template>
  <v-app :theme="theme.global.name.value">
    <v-app-bar>
      <v-container class="d-flex py-0">
        <div class="d-flex align-center ga-3">
          <RouterLink :to="{ name: 'home' }">Home</RouterLink>
          <RouterLink :to="{ name: 'about' }">About</RouterLink>
        </div>
        <v-spacer></v-spacer>
        <v-btn :icon="theme.name.value === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" slim
          @click="toggleTheme" />
        <v-btn icon="mdi-logout" slim @click="logout" />
      </v-container>
    </v-app-bar>

    <v-main height="100%" width="100%">
      <v-container height="100%">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
