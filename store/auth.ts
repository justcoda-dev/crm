import { defineStore } from "pinia";
import type { ILoginFormData } from "~/components/forms/LoginForm.vue";
import type { IRegistrationFormData } from "~/components/forms/RegistrationForm.vue";
import { useMyUserStore } from "./user";
import type { IEnterpircesData } from "~/TS/IEnterprice";

export const useMyAuthStore = defineStore("myAuthStore", () => {
  const userStore = useMyUserStore();

  const authenticated = ref(false);
  const loading = ref(false);
  const user = ref();
  const date = new Date();
  const jwt = useCookie("jwt", {
    maxAge: 1000 * 60 * 60,
  });
  const authError = ref();
  const app = useNuxtApp();

  const checkAuth = () => {
    if (jwt.value) {
    }
  };

  const login = async (formData: ILoginFormData) => {
    try {
      loading.value = true;
      const data: any = await app.$apiFetch("/auth/local", {
        method: "POST",
        body: {
          ...formData,
          identifier: formData.email,
        },
      });
      if (data.jwt) {
        loading.value = true;
        jwt.value = data.jwt;
        authenticated.value = true;
        userStore.user = data.user;
        window.localStorage.setItem("user", JSON.stringify(data.user));
      }
      authError.value = null;
    } catch (e) {
      console.error(e);
      authError.value = e;
      loading.value = false;
    }
  };

  const registration = async (formData: IRegistrationFormData) => {
    try {
      loading.value = true;

      const { data: checkSecretKey }: { data: IEnterpircesData } =
        await app.$apiFetch(
          `/enterprises?filters[secret_key]=${formData.secret_key}`
        );

      const enterpriseId = checkSecretKey[0].id;
      if (enterpriseId) {
        const data: any = await app.$apiFetch("/auth/local/register", {
          method: "POST",
          body: { ...formData, enterprise: enterpriseId },
        });

        if (data.jwt) {
          jwt.value = data.jwt;
          authenticated.value = true;
          userStore.user = data.user;
          loading.value = false;
          window.localStorage.setItem("user", JSON.stringify(data.user));

          const hotels: any = await app.$apiFetch(
            `/hotels?filters[enterprise]=${enterpriseId}`,
            {
              headers: {
                Authorization: `Bearer ${jwt.value}`,
              },
            }
          );

          await app.$apiFetch(`/users/${data.user.id}`, {
            headers: {
              Authorization: `Bearer ${jwt.value}`,
            },
            method: "PUT",
            body: { hotels: [...hotels.data] },
          });
        }
        authError.value = null;
      }
    } catch (e) {
      console.error(e);
      authError.value = e;
      loading.value = false;
    }
  };

  const logout = () => {
    authenticated.value = false;
    jwt.value = null;
    user.value = null;
    window.localStorage.setItem("user", JSON.stringify(null));
  };

  return {
    jwt,
    authenticated,
    authError,
    login,
    logout,
    registration,
    loading,
  };
});
