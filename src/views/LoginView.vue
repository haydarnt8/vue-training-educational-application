<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import type { VForm } from "vuetify/components";

const router = useRouter();
const formRef = ref<VForm>();
const loading = ref(false);
const form = reactive({
  email: "",
  password: "",
});

async function submit() {
  await formRef.value?.validate().then((valid) => {
    if (valid) {
      login();
    }
  });
}

async function login() {
  loading.value = true;
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random() < 0.5);
    }, 2000);
  });
  await promise.then((returnTrue) => {
    loading.value = false;
    if (returnTrue) {
      localStorage.setItem("access_token", form.email + form.password);
      router.push({ name: "home" });
    } else {
      alert("Login failed");
    }
  });
}

function validateEmail(value: string) {
  if (!value) return true;
  return /.+@.+\..+/.test(value) || "E-mail must be valid";
}

function validatePassword(value: string) {
  if (!value) return true;
  return value.length >= 8 || "Password must be at least 8 characters";
}

function validateRequired(value: string) {
  return !!value || "Required.";
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" offset-sm="3">
        <v-card>
          <v-card-title>
            <span class="headline">Login</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="formRef">
              <v-text-field
                v-model="form.email"
                label="Email"
                type="email"
                :rules="[validateEmail, validateRequired]"
              />
              <v-text-field
                v-model="form.password"
                label="Password"
                type="password"
                :rules="[validatePassword, validateRequired]"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn :loading="loading" color="primary" @click="submit">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
