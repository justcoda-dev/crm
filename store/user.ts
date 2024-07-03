import { defineStore } from "pinia";
import { useMyAuthStore } from "./auth";

export const useMyUserStore = defineStore("myUserStore", () => {
  const store = useMyAuthStore();
  const app = useNuxtApp();
  const user = ref();
  const getUser = async () => {
    try {
      const response = await app.$apiFetch("users/me?populate=*");
      user.value = response;
    } catch (e) {
      console.error("get user data error", e);
      if (e.status === 401) {
        store.logout();
      }
    }
  };

  return { user, getUser };
});
