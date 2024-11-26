<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import { computed } from "vue";
import Blank from "./layouts/BlankLayout.vue";
import Main from "./layouts/MainLayout.vue";

const route = useRoute();

const layout = computed(() => {
  return route.meta.layout === "blank" ? Blank : Main;
});
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
