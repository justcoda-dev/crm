<template>
  <v-card class="pa-3">
    <v-card-title class="text-h5 text-center">{{
      props.title || "Створити кімнату"
    }}</v-card-title>

    <v-form @submit.prevent="onSubmit">
      <v-card-text class="pa-6">
        <v-combobox
          class="px-3 pb-3"
          v-model="form.name"
          v-model:menu="menuState"
          :label="$t('text-field.name.placeholder')"
          :items="hotelsList"
          :hide-no-data="hideNoData"
          :error-messages="errorMessages"
        />
        <v-text-field
          class="px-3 pb-3"
          v-model="form.max_count"
          :label="$t('text-field.max-count.placeholder')"
          :hide-no-data="hideNoData"
          :error-messages="errorMessages"
        />
        <v-card-actions class="justify-center ma-3"
          ><v-btn class="mr-4" type="submit" color="primary">
            {{ $t("button-submit") }}
          </v-btn>

          <v-btn v-bind="props" variant="tonal" @click="onCancel">
            {{ $t("button-cancel") }}
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
interface IProps {
  title?: string;
}
const props = defineProps<IProps>();
const emit = defineEmits(["onSubmit", "onCancel"]);
const menuState = ref(false);
const initialForm = {
  name: "",
  max_count: "",
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
