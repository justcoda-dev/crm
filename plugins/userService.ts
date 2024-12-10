import type { IUser } from "~/TS/IUser";
export default defineNuxtPlugin((nuxtApp) => {
  const userService = () => {};
  const app = useNuxtApp();

  userService.postUser = () => {};

  userService.getUser = async () => {
    try {
      return await app.$apiFetch<IUser>("users/me?populate=*");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  userService.updateUser = () => {};
  return {
    provide: {
      userService,
    },
  };
});
