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
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        v-model="formData.email"
        :placeholder="$t('text-field.email.placeholder')"
      />
      <div class="text-subtitle-1 text-medium-emphasis">
        Сикретний код підприємства
      </div>

      <v-text-field
        density="compact"
        placeholder="Сикретний код підприємства"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
        v-model="formData.secret_key"
      />
      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        {{ $t("text-field.password.name") }}
      </div>

      <v-text-field
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        density="compact"
        v-model="formData.password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        :placeholder="$t('text-field.password.placeholder')"
        @click:append-inner="visible = !visible"
      />
      <div
        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
      >
        {{ $t("text-field.password-repeat.name") }}
      </div>

      <v-text-field
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        density="compact"
        v-model="formData.passwordRepeat"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        :placeholder="$t('text-field.password-repeat.placeholder')"
        @click:append-inner="visible = !visible"
      />

      <v-btn
        block
        class="mb-8"
        color="blue"
        size="large"
        variant="tonal"
        type="submit"
        :loading="props.loading"
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
export interface IRegistrationFormData {
  username: string;
  email: string;
  password: string;
  passwordRepeat: string;
  secret_key: string;
}
interface IProps {
  errorMessage?: any;
  loading?: boolean;
}
const props = defineProps<IProps>();
const emit = defineEmits(["onSubmit", "update:changeComponent"]);

const visible = ref(false);

const formData = ref<IRegistrationFormData>({
  username: "",
  email: "",
  secret_key: "",
  password: "",
  passwordRepeat: "",
});

const onSubmit = () => {
  emit("onSubmit", formData.value);
};

const onChangeForm = () => {
  emit("update:changeComponent", "LoginForm");
};
watch(
  () => formData.value.email,
  (value) => (formData.value.username = value)
);
</script>
