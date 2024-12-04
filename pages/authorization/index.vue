<template>
  <keep-alive>
    <component
      v-model:changeComponent="currentComponent"
      :is="isComponent[currentComponent]"
      v-bind="sharedProps[currentComponent]"
      v-on="sharedEvents[currentComponent]"
    />
  </keep-alive>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/auth";
import { type ILoginFormData } from "../../components/forms/LoginForm.vue";
import { type IRegistrationFormData } from "~/components/forms/RegistrationForm.vue";

const meta = definePageMeta({
  layout: "authorization",
});

const { login, registration } = useMyAuthStore();
const { authenticated, authError, loading } = storeToRefs(useMyAuthStore());

const currentComponent = shallowRef("LoginForm");
const isComponent = computed<Record<string, any>>(() => {
  return {
    LoginForm: defineAsyncComponent(
      () => import("../../components/forms/LoginForm.vue")
    ),
    RegistrationForm: defineAsyncComponent(
      () => import("../../components/forms/RegistrationForm.vue")
    ),
  };
});
const sharedProps = computed<Record<string, any>>(() => {
  return {
    LoginForm: {
      loading: loading.value,
      errorMessage: authError.value,
    },
    RegistrationForm: {
      loading: loading.value,
      errorMessage: authError.value,
    },
  };
});
const sharedEvents: Record<string, any> = {
  LoginForm: {
    onSubmit: async (formData: ILoginFormData) => {
      await login(formData);
      if (authenticated.value) {
        navigateTo("/");
      }
    },
  },
  RegistrationForm: {
    onSubmit: async (formData: IRegistrationFormData) => {
      await registration(formData);
      if (authenticated.value) {
        navigateTo("/");
      }
    },
  },
};
</script>

<style scoped></style>
