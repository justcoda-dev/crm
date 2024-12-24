import { requestFiltersCreator } from "~/functions/requestFiltersCreate";
import type { IService } from "~/TS/IService";
import type { IUser, IUserData } from "~/TS/IUser";
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
    getDataByFilter: async (obj: { [key: string]: ID | ID[] | string }) => {
      try {
        const { data } = await app.$apiFetch<IUserData>(
          `users?${requestFiltersCreator(obj)}&populate=*`
        );
        return data;
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
