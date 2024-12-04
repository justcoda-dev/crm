import { type UseFetchOptions } from "nuxt/app";

export default defineNuxtPlugin((nuxtApp) => {
  const {
    public: { apiBase },
  } = useRuntimeConfig();

  const getJwt = () => useCookie("jwt").value;

  const apiFetch = $fetch.create({
    baseURL: `${apiBase}/api`,
    async onRequest({ options }) {
      const jwt = getJwt();

      if (jwt) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${jwt}`,
        };
      }
    },
  });
  const useApiFetch = async <DataT>(
    url: string | (() => string),
    options?: UseFetchOptions<DataT>
  ) => useFetch(url, { ...options, $fetch: apiFetch as typeof $fetch });

  return {
    provide: {
      useApiFetch,
      apiFetch,
    },
  };
});
