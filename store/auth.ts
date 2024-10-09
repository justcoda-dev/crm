import { defineStore } from "pinia";
import type { ILoginFormData } from "~/components/forms/LoginForm.vue";
import type { IRegistrationFormData } from "~/components/forms/RegistrationForm.vue";
import { useMyUserStore } from "./user";

export const useMyAuthStore = defineStore("myAuthStore", () => {
  const userStore = useMyUserStore();

  const authenticated = ref(false);
  const loading = ref(false);
  const user = ref();
  const date = new Date();
  const jwt = useCookie("jwt", {
    maxAge: 1000 * 60 * 60,
  });
  const authError = ref(null);
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
        userStore.user = data.user;
        window.localStorage.setItem("user", JSON.stringify(data.user));
      }
      authError.value = null;
    } catch (e) {
      console.error(e);
      authError.value = e;
    }
  };

  const registration = async (formData: IRegistrationFormData) => {
    try {
      const data: any = await app.$apiFetch("/auth/local/register", {
        method: "POST",
        body: formData,
      });
      if (data.jwt) {
        jwt.value = data.jwt;
        authenticated.value = true;
        userStore.user = data.user;
        window.localStorage.setItem("user", JSON.stringify(data.user));
      }
      authError.value = null;
    } catch (e) {
      console.error(e);
      authError.value = e;
    }
  };

  const logout = () => {
    authenticated.value = false;
    jwt.value = null;
    user.value = null;
    window.localStorage.setItem("user", JSON.stringify(null));
  };

  return { jwt, authenticated, authError, login, logout, registration };
});
