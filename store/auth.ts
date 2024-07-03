import { defineStore } from "pinia";
import type { ILoginFormData } from "~/components/forms/LoginForm.vue";
import type { IRegistrationFormData } from "~/components/forms/RegistrationForm.vue";

export const useMyAuthStore = defineStore("myAuthStore", () => {
  const authenticated = ref(false);
  const loading = ref(false);
  const date = new Date();
  const jwt = useCookie("jwt", {
    maxAge: 1000 * 60 * 60,
  });
  const app = useNuxtApp();

  const checkAuth = () => {
    if (jwt.value) {
    }
  };

  const login = async (formData: ILoginFormData) => {
    try {
      const data: any = await app.$apiFetch("/auth/local", {
        method: "POST",
        body: {
          ...formData,
          identifier: formData.email,
        },
      });
      if (data.jwt) {
        jwt.value = data.jwt;
        authenticated.value = true;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const registration = async (formData: IRegistrationFormData) => {
    try {
      const data: any = await app.$apiFetch("/auth/local/register", {
        method: "POST",
        body: formData,
      });
      if (data) {
        jwt.value = data.jwt;
        authenticated.value = true;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const logout = () => {
    authenticated.value = false;
    jwt.value = null;
  };

  return { jwt, authenticated, login, logout, registration };
});
