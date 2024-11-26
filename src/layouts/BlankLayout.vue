<script lang="ts" setup>
import { useTheme } from 'vuetify'

const theme = useTheme()
</script>

<template>
  <v-app :theme="theme.global.name.value">
    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
