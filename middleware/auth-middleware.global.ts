import { useMyAuthStore } from "~/store/auth";
export default defineNuxtRouteMiddleware((to, from) => {
  const { authenticated } = storeToRefs(useMyAuthStore());
  const jwt = useCookie("jwt");
  if (jwt.value) {
    authenticated.value = true;
  }
  if (jwt.value && to.name === "authorization") {
    return navigateTo("/");
  }
  if (!jwt.value && to.name !== "authorization") {
    abortNavigation();
    return navigateTo("/authorization");
  }
});
