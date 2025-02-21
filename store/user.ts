import { defineStore } from "pinia";
import { useMyAuthStore } from "./auth";
import type { IUser } from "~/TS/IUser";
import type { IHotel } from "~/TS/IHotel";
import type { IEnterpirse } from "~/TS/IEnterprice";

export const useMyUserStore = defineStore("myUserStore", () => {
  const store = useMyAuthStore();
  const app = useNuxtApp();
  const user = ref<IUser | null>();
  const loading = ref(false);
  const userHotels = computed<IHotel[] | undefined>(() => user.value?.hotels);
  const userEnterprise = computed<IEnterpirse | undefined>(
    () => user.value?.enterprise
  );

  const getUser = async () => {
    try {
      loading.value = true;
      const userData = await app.$userService.getData();
      user.value = userData;

      loading.value = false;
    } catch (error: any) {
      loading.value = false;
      console.log(Error, error);
      console.error("get user data error", error);
      if (error.status === 401) {
        store.logout();
      }
    }
  };

  return { user, getUser, userHotels, userEnterprise, loading };
});
