import { requestFiltersCreator } from "~/functions/requestFiltersCreate";
import type { IService } from "~/TS/IService";
import type { IUser } from "~/TS/IUser";
import type { ID } from "~/TS/myTypes";
export default defineNuxtPlugin((nuxtApp) => {
  const app = useNuxtApp();
  const userService: Omit<
    IService,
    "deleteById" | "postData" | "updateDataById"
  > = {
    getData: async () => {
      try {
        return await app.$apiFetch<IUser>("users/me?populate=*");
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    getDataByFilter: async (ids: ID | ID[], filterKey: string) => {
      try {
        return await app.$apiFetch<IUser[]>(
          `users?${requestFiltersCreator(ids, filterKey)}&populate=*`
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  };

  return {
    provide: {
      userService,
    },
  };
});
