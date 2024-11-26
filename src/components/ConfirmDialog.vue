<script setup lang="ts">
interface Props {
  message?: string;
  title?: string;
  confirmMessage?: string;
  cancelMessage?: string;
  withLoading?: boolean;
  loading?: boolean;
  color?: string | "error" | "warning" | "info" | "success" | "primary" | "secondary";
  cancelColor?:
    | string
    | "error"
    | "warning"
    | "info"
    | "success"
    | "primary"
    | "secondary";
  cancelVariant?: string | "elevated" | "flat" | "outlined";
}
const model = defineModel<boolean>();
const props = defineProps<Props>();
interface Emit {
  (e: "confirm", value: boolean, close?: () => void): void;
}
const emit = defineEmits<Emit>();

function onConfirmation() {
  if (props.withLoading) {
    emit("confirm", true, () => {
      model.value = false;
    });
  } else {
    emit("confirm", true);
    model.value = false;
  }
}

function onCancel() {
  emit("confirm", false);
  model.value = false;
}
</script>

<template>
  <VDialog
    max-width="500"
    v-model="model"
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
    content-class="rounded-lg"
  >
    <VCard>
      <VCardText class="px-5 m-0 py-0 py-5 pb-8">
        <h3 class="text-black mb-4">
          {{ props.title ?? "" }}
        </h3>
        {{ message ?? "" }}
      </VCardText>

      <VCardText class="d-flex align-center justify-end ga-2">
        <VBtn
          :loading="props.loading"
          variant="elevated"
          :color="color ?? 'primary'"
          @click="onConfirmation"
        >
          {{ props.confirmMessage ?? "تأكيد" }}
        </VBtn>

        <VBtn :color="cancelColor ?? 'secondary'" variant="outlined" @click="onCancel">
          {{ props.cancelMessage ?? "الغاء" }}
        </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>
