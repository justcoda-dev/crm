// https://nuxt.com/docs/api/configuration/nuxt-config
import LOCALES from "./constants/i18n";

export default defineNuxtConfig({
// @ts-ignore
    ssr: true,
    runtimeConfig: {
        // The private keys which are only available within server-side
        apiSecret: '123',
        // Keys within public, will be also exposed to the client-side
        public: {
            // apiBase: process.env.NODE_ENV === "development" ? "http://localhost:1337/api" : "https://api.salesmarket.site/api",
            apiBase: "https://api.salesmarket.site/api",
        }
    },
    devtools: {enabled: true},
    modules: [
        '@invictus.codes/nuxt-vuetify',
        "nuxt-lodash",
        '@pinia/nuxt',
        '@samk-dev/nuxt-vcalendar',

    ],
// @ts-ignore
    vuetify: {
        /* vuetify options */
        vuetifyOptions: {},
        moduleOptions: {
            //   /* nuxt-vuetify module options */
            //   treeshaking: true | false,
            //   useIconCDN: true | false,
            //   /* vite-plugin-vuetify options */
            //   styles: true | 'none' | 'expose' | 'sass' | { configFile: string },
            //   autoImport: true | false,
            //   useVuetifyLabs: true | false,
        }
    },
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
    // @ts-ignore
    // configuration inside ./plugins/i18n.ts
    i18n: {}
})
