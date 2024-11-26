<script setup lang="ts">
import TodoForm from "@/components/TodoForm.vue";
import TodoList from "@/components/TodoList.vue";
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <TodoForm />
      </v-col>
      <v-col cols="12">
        <TodoList />
      </v-col>
    </v-row>
  </v-container>
</template>
