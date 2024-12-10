<template>
  <v-snackbar
    :timeout="props.timeout || timeoutDefault"
    :color="statusProps[props.type || 'message'].color"
    v-model="showStatus"
    elevation="24"
    :location="props.location || 'top'"
  >
    <div class="text-capitalize d-flex justify-space-between">
      <span>{{ props.status || "Empty message" }} </span>
      <v-icon :icon="statusProps[props.type || 'message'].icon"></v-icon>
      <slot></slot>
    </div>
  </v-snackbar>
</template>

<script lang="ts" setup>
const timeoutDefault = 3000;
interface IProps {
  status?: string;
  timeout?: number;
  type?: "error" | "success" | "message";
  location?: "top" | "bottom";
}
const showStatus = defineModel({ default: false });
const props = defineProps<IProps>();

const statusProps: { [key: string]: any } = {
  error: {
    color: "red",
    icon: "mdi-cancel",
  },
  success: {
    color: "green",
    icon: "mdi-check-circle",
  },
  message: {
    color: "indigo",
    icon: "mdi-chat",
  },
};
</script>

<style></style>
