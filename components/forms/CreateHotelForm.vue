<template>
  <v-form>
    <v-combobox
      v-model="form.model.value.name"
      v-model:menu="menuState"
      :label="$t('text-field.name.placeholder')"
      :items="hotelsList"
      :hide-no-data="hideNoData"
      :error-messages="form.errorMessages.value?.name"
    />
  </v-form>
</template>

<script lang="ts" setup>
const menuState = ref(false);
const form = ref();
const hotelsList = ref();
const hideNoData = ref(false);
</script>

<style></style>
