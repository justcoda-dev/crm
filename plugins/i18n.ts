import {createI18n} from 'vue-i18n'
import LOCALES from "../constants/i18n"

export default defineNuxtPlugin(({vueApp}) => {
    const i18n = createI18n({
        legacy: false,
        globalInjection: true,
        locale: LOCALES.DEFAULT,
        fallbackLocale: LOCALES.FALLBACK,
        messages: LOCALES.FILES
    })

    vueApp.use(i18n)
})