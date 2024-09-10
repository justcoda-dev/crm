<template>
  <v-form @submit.prevent="onSubmitForm">
    <v-combobox
      :label="$t('text-field.name.placeholder')"
      v-model="form.model.value.name"
      :error-messages="form.errorMessages.value?.name"
    />
    <v-combobox
      :label="$t('text-field.phone.placeholder')"
      v-model="form.model.value.phone"
      :error-messages="form.errorMessages.value?.phone"
    />
    <v-btn type="submit" class="ml-4" :disabled="disabledSubmitButton">
      {{ $t("button-submit") }}
    </v-btn>
    <v-btn class="ml-4" @click="onCancel">
      {{ $t("button-cancel") }}
    </v-btn>
  </v-form>
</template>

<script lang="ts" setup>
import type { ID } from "~/TS/myTypes";
import { useValidation } from "~/functions/useValidation";

interface IProps {
  editCostumer: {
    id: ID;
    name: string;
    phone: string;
  };
}
const props = defineProps<IProps>();
const emit = defineEmits();
const disabledSubmitButton = ref(true);

const form = useValidation({ ...props.editCostumer }, [
  {
    prop: "name",
    rules: [
      {
        fn: (value: string) => value?.length > 4,
        errorMessage: "Імя'я має мітити більше 4 символів",
      },
    ],
  },
  {
    prop: "phone",
    rules: [
      {
        fn: (value: string) => value?.startsWith("+38"),
        errorMessage: "Номер телефону повинен починатись з '+380'",
      },
      {
        fn: (value: string) => value?.length === 13,
        errorMessage: "Номер телефону мітить біль 13 символів",
      },
      {
        fn: (value: string) => +value,
        errorMessage: "Номер складається тільки з цифер",
      },
    ],
  },
]);

const onSubmitForm = () => {
  emit("submitForm", form.model.value);
};

const onCancel = () => {
  emit("cancelCLick");
};

watch(
  () => form.haveErrors.value,
  (status: any) => {
    disabledSubmitButton.value = status;
  }
);
watch(
  () => [form.model.value.name, form.model.value.phone],
  ([name, phone]) => {
    if (
      !(name === props.editCostumer.name && phone === props.editCostumer.phone)
    ) {
      disabledSubmitButton.value = true;
    }
  }
);
</script>

<style lang="scss" scoped>
.v-combobox {
  &__select-item {
    cursor: pointer;
  }
}
</style>
