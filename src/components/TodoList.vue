<script lang="ts" setup>
import { useTodoStore } from "@/stores/todoStore";
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import ConfirmDialog from "./ConfirmDialog.vue";

const isEdit = reactive<{ value: boolean; index: number | null }>({
  value: false,
  index: null,
});
const items = ["all", "completed", "uncompleted"];
const router = useRouter();
const route = useRoute();
const typeFilter = ref((route.query.type as string) || "all");
const store = useTodoStore();
const confirmDialog = ref(false);
const selectedTodoIndex = ref<number | null>(null);
const removeTodoLoading = reactive<{ value: boolean; index: number | null }>({
  value: false,
  index: null,
});
const updateTodoLoading = reactive<{ value: boolean; index: number | null }>({
  value: false,
  index: null,
});
const todos = computed(() => {
  switch (typeFilter.value) {
    case "completed":
      return store.completedTodos;
    case "uncompleted":
      return store.uncompletedTodos;
    default:
      return store.allTodos;
  }
});

function setRemoveTodoLoading(value: boolean, index: number | null, key?: string) {
  if (key === "removeTodoLoading") {
    removeTodoLoading.value = value;
    removeTodoLoading.index = index;
  } else {
    updateTodoLoading.value = value;
    updateTodoLoading.index = index;
  }
}
function resetRemoveTodoLoading(key?: string) {
  if (key === "removeTodoLoading") {
    removeTodoLoading.value = false;
    removeTodoLoading.index = null;
  } else {
    updateTodoLoading.value = false;
    updateTodoLoading.index = null;
  }
}
function openConfirmDialog(index: number) {
  selectedTodoIndex.value = index;
  confirmDialog.value = true;
}

async function removeTodo(value: boolean, close?: () => void) {
  if (selectedTodoIndex.value !== null && value) {
    setRemoveTodoLoading(true, selectedTodoIndex.value, "removeTodoLoading");
    try {
      await store.removeTodo(selectedTodoIndex.value);
    } finally {
      resetRemoveTodoLoading("removeTodoLoading");
      if (close) close();
    }
  }
}

async function updateStatus(index: number) {
  setRemoveTodoLoading(true, index, "updateTodoLoading");
  try {
    await store.toggleCompleted(index);
  } finally {
    resetRemoveTodoLoading("updateTodoLoading");
  }
}

function cancel() {
  store.clearSelectedTodo();
}

function editTodo(index: number) {
  if (isEdit.value && isEdit.index === index) {
    cancel();
  } else {
    isEdit.index = index;
    store.selectTodoByIndex(index);
  }
}
watch(
  () => store.selectedTodo,
  (newValue) => {
    isEdit.value = !!newValue;
  },
  { immediate: true }
);

watch(
  () => typeFilter.value,
  (newValue) => {
    router.push({ query: { type: newValue } });
  },
  { immediate: true }
);
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between ga-3 align-center">
            <span class="headline">Todo List</span>
            <!-- <v-select width="200" v-model="typeFilter" :items="['all', 'completed', 'uncompleted']"
              label="Filter"></v-select> -->
            <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props"></v-btn>
              </template>

              <v-list>
                <v-list-item
                  v-for="(item, i) in items"
                  :key="i"
                  @click="typeFilter = item"
                >
                  <v-list-item-title :class="{ 'text-primary': typeFilter === item }">
                    {{ item }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item-group class="d-flex flex-column ga-2">
                <v-list-item
                  v-for="todo in todos.slice().reverse()"
                  :key="todo.index"
                  class="border rounded"
                >
                  <v-list-item-content class="d-flex align-center">
                    <div>
                      <v-list-item-title>{{ todo.title }}</v-list-item-title>
                      <v-list-item-subtitle>{{ todo.description }}</v-list-item-subtitle>
                    </div>
                    <v-spacer></v-spacer>
                    <div class="d-flex ga-2 align-center">
                      <v-btn
                        color="error"
                        size="x-small"
                        :loading="
                          removeTodoLoading.value &&
                          removeTodoLoading.index === todo.index
                        "
                        icon="mdi-delete"
                        @click="openConfirmDialog(todo.index!)"
                      ></v-btn>
                      <v-btn
                        color="warning"
                        size="x-small"
                        :icon="
                          isEdit.value && isEdit.index === todo.index
                            ? 'mdi-close'
                            : 'mdi-pencil'
                        "
                        @click="editTodo(todo.index!)"
                      ></v-btn>
                      <v-btn
                        size="x-small"
                        :color="todo.completed ? 'success' : 'primary'"
                        :loading="
                          updateTodoLoading.value &&
                          updateTodoLoading.index === todo.index
                        "
                        :icon="
                          todo.completed
                            ? 'mdi-checkbox-marked'
                            : 'mdi-checkbox-blank-outline'
                        "
                        @click="updateStatus(todo.index!)"
                      ></v-btn>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <ConfirmDialog
      v-model="confirmDialog"
      @confirm="removeTodo"
      title="Delete Todo"
      message="Are you sure you want to delete this todo?"
      color="error"
      confirmMessage="Delete"
      cancelMessage="Cancel"
      :loading="removeTodoLoading.value"
      cancelColor="primary"
      cancelVariant="outlined"
      withLoading
    />
  </v-container>
</template>
