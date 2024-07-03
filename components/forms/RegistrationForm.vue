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
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        v-model="formData.email"
      />

      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        {{ $t("text-field.password.name") }}
      </div>

      <v-text-field
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        :placeholder="$t('text-field.password.placeholder')"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
        v-model="formData.password"
      />
      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        {{ $t("text-field.password-repeat.name") }}
      </div>

      <v-text-field
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        :placeholder="$t('text-field.password-repeat.placeholder')"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        @click:append-inner="visible = !visible"
        v-model="formData.passwordRepeat"
      />

      <v-btn
        block
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        type="submit"
      >
        {{ $t("button-register") }}
      </v-btn>

      <v-card-text class="text-center">
        <a
          class="text-blue text-decoration-none"
          href="#"
          rel="noopener noreferrer"
          target="_blank"
          @click.prevent="onChangeForm"
        >
          {{ $t("button-change.to-login") }}
          <v-icon icon="mdi-chevron-right" />
        </a>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script lang="ts" setup>
import LoginForm from "./LoginForm.vue";

export interface IRegistrationFormData {
  username: string;
  email: string;
  password: string;
  passwordRepeat: string;
}
const emit = defineEmits();

const visible = ref(false);

const formData = ref<IRegistrationFormData>({
  username: "",
  email: "",
  password: "",
  passwordRepeat: "",
});

const onSubmit = () => {
  emit("onSubmit", formData.value);
};

const onChangeForm = () => {
  emit("update:changeComponent", LoginForm);
};
watch(
  () => formData.value.email,
  (value) => (formData.value.username = value)
);
</script>
