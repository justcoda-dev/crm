import { defineStore } from "pinia";
import { useMyAuthStore } from "./auth";
import type { IUser } from "~/TS/IUser";
import type { IHotel } from "~/TS/IHotel";
import type { IEnterpirce } from "~/TS/IEnterprice";

export const useMyUserStore = defineStore("myUserStore", () => {
  const store = useMyAuthStore();
  const app = useNuxtApp();
  const user = ref<IUser | null>();
  const loading = ref(false);
  const userHotels = computed<IHotel[] | undefined>(() => user.value?.hotels);
  const userEnterprice = computed<IEnterpirce | undefined>(
    () => user.value?.enterprice
  );

  const getUser = async () => {
    try {
      loading.value = true;
      const userData = await app.$userService.getUser();
      user.value = userData;
      loading.value = false;
    } catch (error: any) {
      loading.value = false;
      console.error("get user data error", error);
      if (error.status === 401) {
        store.logout();
      }
    }
  };

  return { user, getUser, userHotels, userEnterprice, loading };
});
