<template>
  <keep-alive>
    <component
      @onSubmit="onSubmit"
      :is="currentComponent"
      :errorMessage="authError"
      v-model:changeComponent="currentComponent"
    />
  </keep-alive>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/auth";
import LoginForm, {
  type ILoginFormData,
} from "../../components/forms/LoginForm.vue";
import { type IRegistrationFormData } from "~/components/forms/RegistrationForm.vue";

const meta = definePageMeta({
  layout: "authorization",
});

const currentComponent = shallowRef(LoginForm);
const { login, registration } = useMyAuthStore();
const { authenticated, authError } = storeToRefs(useMyAuthStore());

const onSubmit = async (formData: ILoginFormData | IRegistrationFormData) => {
  if (currentComponent.value === LoginForm) {
    await login(formData as ILoginFormData);
    if (authenticated.value) {
      navigateTo("/");
    }
  } else {
    await registration(formData as IRegistrationFormData);
    if (authenticated.value) {
      navigateTo("/");
    }
  }
};
</script>

<style scoped></style>
