// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  // @ts-ignore
  build: {
    transpile: ["vuetify"],
  },
  devServer: {
    host: "0.0.0.0",
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  ssr: true,
  runtimeConfig: {
    // The private keys which are only available within server-side
    apiSecret: "123",
    // Keys within public, will be also exposed to the client-side
    public: {
      apiBase:
        process.env.NODE_ENV === "development"
          ? "http://localhost:1337"
          : "http://localhost:1337",
      // apiBase: "https://api.salesmarket.site/api",
    },
  },
  devtools: { enabled: true },
  modules: [
    "@samk-dev/nuxt-vcalendar",
    "nuxt-lodash",
    "@pinia/nuxt",
    "@nuxtjs/i18n",
    "@nuxt/eslint",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  lodash: {
    prefix: "_",
    prefixSkip: ["string"],
    upperAfterPrefix: false,
    exclude: ["map"],
    alias: [
      ["camelCase", "stringToCamelCase"], // => stringToCamelCase
      ["kebabCase", "stringToKebab"], // => stringToKebab
      ["isDate", "isLodashDate"], // => _isLodashDate
    ],
  },
  i18n: {
    vueI18n: "./TS/i18.config.ts",
  },
  // @ts-ignore
  css: ["vuetify/dist/vuetify.css", "assets/styles/global.css"],
});
