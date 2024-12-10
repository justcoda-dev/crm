<template>
  <v-card class="py-6">
    <v-card-text class="text-center text-h6">{{ props.text }}</v-card-text>
    <div class="d-flex justify-center">
      <v-btn variant="text" class="mx-1" @click="onSubmit">{{
        $t("button-submit")
      }}</v-btn>
      <v-btn variant="text" class="mx-1" @click="onCancel">{{
        $t("button-cancel")
      }}</v-btn>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
interface IProps {
  text?: string;
}
const props = defineProps<IProps>();
const emit = defineEmits(["onSubmit", "onCancel"]);
const onSubmit = () => {
  emit("onSubmit");
};
const onCancel = () => {
  emit("onCancel");
};
</script>

<style></style>
