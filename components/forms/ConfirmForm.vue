<template>
  <v-card class="pa-3">
    <v-card-title class="text-h5 text-center"
      >Підтвердіть операцію</v-card-title
    >
    <v-form @submit.prevent="onSubmit">
      <v-card-text class="pa-6 text-center">
        <span class="text-center text-h6">{{ props.text }}</span>
        <v-card-actions class="justify-center ma-3">
          <v-btn class="mr-3" color="primary" type="submit">{{
            $t("button-submit")
          }}</v-btn>
          <v-btn variant="tonal" @click="onCancel">{{
            $t("button-cancel")
          }}</v-btn>
        </v-card-actions>
      </v-card-text>
    </v-form>
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
