<template>
  <v-form @submit.prevent="onSubmit">
    <v-card
      class="mx-auto pa-10 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">
        {{ $t("text-field.email.name") }}
      </div>
      <v-text-field
        density="compact"
        :placeholder="$t('text-field.email.placeholder')"
        :error-messages="emailError"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        v-model="form.model.value.email"
      />
      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        {{ $t("text-field.password.name") }}
        <a
          class="text-caption text-decoration-none text-blue"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
        >
          {{ $t("button-forgot.password") }}
        </a>
      </div>
      <v-text-field
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :error-messages="passwordError"
        :type="visible ? 'text' : 'password'"
        density="compact"
        :placeholder="$t('text-field.password.placeholder')"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
        v-model="form.model.value.password"
      />

      <v-card
        v-if="props.errorMessage"
        class="mb-12"
        color="surface-variant"
        variant="tonal"
      >
        <v-card-text class="text-medium-emphasis text-caption">
          {{ props.errorMessage.data.error.name }}
        </v-card-text>
      </v-card>
      <v-btn
        block
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        type="submit"
        :disabled="submitDisabled"
      >
        {{ $t("button-login") }}
      </v-btn>
      <v-card-text class="text-center">
        <a
          class="text-blue text-decoration-none"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
          @click.prevent="onChangeForm"
        >
          {{ $t("button-change.to-register") }}
          <v-icon icon="mdi-chevron-right" />
        </a>
      </v-card-text>
    </v-card>
  </v-form>
</template>
<script lang="ts" setup>
import { useValidation } from "~/functions/useValidation";
import RegistrationForm from "./RegistrationForm.vue";

export interface ILoginFormData {
  email: string;
  password: string;
}
interface IProps {
  errorMessage?: any;
}
const props = defineProps<IProps>();
const emit = defineEmits();
const visible = ref(false);

const form = useValidation({ email: "", password: "" }, [
  {
    prop: "email",
    rules: [
      { fn: (value: string) => value.length > 3, errorMessage: "to small" },
    ],
  },
  {
    prop: "password",
    rules: [
      { fn: (value: string) => value.length > 3, errorMessage: "to small" },
    ],
  },
]);

const emailError = computed(() =>
  form.errorMessages.value.email?.length
    ? form.errorMessages.value.email[0]
    : ""
);
const passwordError = computed(() =>
  form.errorMessages.value.password?.length
    ? form.errorMessages.value.password[0]
    : ""
);
const submitDisabled = ref(true);

const onSubmit = () => {
  emit("onSubmit", form.model.value);
  console.log(form.model.value);
};
const onChangeForm = () => {
  emit("update:changeComponent", RegistrationForm);
};
watch(
  () => [form.model.value.email, form.model.value.password],
  ([email, password]) => {
    if (email && password) {
      submitDisabled.value = !!passwordError.value || !!emailError.value;
    }
  }
);
watch(
  () => props.errorMessage,
  (value) => {
    console.log(props);
  }
);
</script>
