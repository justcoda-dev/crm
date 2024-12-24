// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import {
  VBtn,
  VCardActions,
  VCombobox,
  VContainer,
  VTextField,
} from "vuetify/components";
import colors from "vuetify/util/colors";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // ... your configuration
    theme: {
      defaultTheme: "lightTheme",
      themes: {
        lightTheme: {
          dark: false,
          colors: {
            primary: "#6a6cff",
            error: "#ff3e1d",
            secondary: "#22303ee6",
            background: "#f5f5f9",
            "on-surface": "#1e2b37",
          },
          variables: {},
        },
      },
    },
    defaults: {
      global: {
        VContainer: {},
      },
      VCombobox: {
        variant: "outlined",
        density: "compact",
      },
      VBtn: {
        variant: "flat",
      },

      VTextField: {
        variant: "outlined",
        density: "compact",
        color: "primary",
      },
      VCardActions: {
        VBtn: {
          variant: "flat",
        },
      },
      VCard: {
        style: [{ borderRadius: "6px" }],
      },
    },
  });
  app.vueApp.use(vuetify);
});
