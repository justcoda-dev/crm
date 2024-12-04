import { defineStore } from "pinia";
import { useMyAuthStore } from "./auth";
import type { IUser } from "~/TS/IUser";
import type { IHotel } from "~/TS/IHotel";
import type { IEnterpirce } from "~/TS/IEnterprice";

export const useMyUserStore = defineStore("myUserStore", () => {
  const store = useMyAuthStore();
  const app = useNuxtApp();
  const user = ref();
  const loading = ref(false);
  const userHotels = computed<IHotel[]>(() => user.value.hotels);
  const userEnterprice = computed<IEnterpirce>(() => user.value.enterprice);

  const getUser = async () => {
    try {
      loading.value = true;
      const { data } = await app.$useApiFetch<IUser>("users/me?populate=*");
      user.value = data.value;
    } catch (e: any) {
      loading.value = false;
      console.error("get user data error", e);
      if (e.status === 401) {
        store.logout();
      }
    }
  };

  return { user, getUser, userHotels, userEnterprice };
});
