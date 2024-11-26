<script lang="ts" setup>
import { useTodoStore } from "@/stores/todoStore";
import { reactive, ref, watch } from "vue";
import type { VForm } from "vuetify/components";
import { el } from "vuetify/locale";

const formRef = ref<VForm>();
const store = useTodoStore();
const loading = ref(false);
const isEdit = ref(false);

const form = reactive({
  title: "",
  description: "",
  completed: false,
});

function clearForm() {
  form.completed = false;
  formRef.value?.reset();
}
async function submit() {
  await formRef.value?.validate().then((valid) => {
    if (valid.valid) {
      if (isEdit.value) {
        updateTodo();
      } else {
        addTodo();
      }
    }
  });
}

async function addTodo() {
  loading.value = true;
  try {
    await store.addTodo({ ...form });
    clearForm();
  } finally {
    loading.value = false;
  }
}

async function updateTodo() {
  loading.value = true;
  try {
    await store.updateTodo({ ...form });
    clearForm();
  } finally {
    loading.value = false;
  }
}

function validateRequired(value: string) {
  return !!value || "Required.";
}

watch(
  () => store.selectedTodo,
  (newValue) => {
    if (newValue) {
      isEdit.value = true;
      form.title = newValue.title || "";
      form.description = newValue.description || "";
      form.completed = newValue.completed || false;
    } else {
      isEdit.value = false;
      clearForm();
    }
  },
  { immediate: true }
);
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span class="headline">{{ (isEdit ? "Edit" : "Add") + " Todo" }}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="formRef" @submit.prevent="submit" class="v-row">
              <v-col cols="12" sm="3">
                <v-text-field
                  hide-details
                  v-model="form.title"
                  label="Title"
                  :rules="[validateRequired]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="7">
                <v-text-field
                  hide-details
                  v-model="form.description"
                  label="Description"
                  :rules="[validateRequired]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="2" class="align-center">
                <v-btn
                  block
                  height="100%"
                  :loading="loading"
                  type="submit"
                  color="primary"
                  >Submit</v-btn
                >
              </v-col>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
