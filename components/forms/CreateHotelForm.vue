<template>
  <v-form @submit.prevent="onSubmit">
    <v-card class="pa-4">
      <v-card-title>Створити Готель</v-card-title>
      <v-card-text class="px-8 py-2">
        <v-combobox
          variant="underlined"
          v-model="form.name"
          v-model:menu="menuState"
          :label="$t('text-field.name.placeholder')"
          :items="hotelsList"
          :hide-no-data="hideNoData"
          :error-messages="errorMessages"
        />
        <v-text-field
          variant="underlined"
          v-model="form.location"
          :label="$t('text-field.name.placeholder')"
          :hide-no-data="hideNoData"
          :error-messages="errorMessages"
        />
      </v-card-text>
      <v-card-actions
        ><v-btn variant="text" type="submit">
          {{ $t("button-submit") }}
        </v-btn>
        <v-btn variant="text" @click="onCancel">
          {{ $t("button-cancel") }}
        </v-btn></v-card-actions
      >
    </v-card>
  </v-form>
</template>

<script lang="ts" setup>
interface IProps {}
const props = defineProps<IProps>();
const emit = defineEmits(["onSubmit", "onCancel"]);
const menuState = ref(false);
const initialForm = {
  name: "",
  location: "",
};
const form = ref(initialForm);
const hotelsList = ref();
const hideNoData = ref(false);
const errorMessages = ref();

const onSubmit = () => {
  emit("onSubmit", form.value);
};
const onCancel = () => {
  emit("onCancel");
};
</script>

<style></style>
