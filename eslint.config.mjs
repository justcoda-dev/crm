import withNuxt from "./.nuxt/eslint.config.mjs";
export default withNuxt(
  // your custom flat configs go here, for example:
  {
    //   files: ['**/*.ts', '**/*.tsx'],
    rules: {
      "no-console": "off", // allow console.log in TypeScript files,
      "vue/script-setup-no-uses-vars": "off",
      "plugin:vue/vue3-essential": true,
      "plugin:vue/vue3-strongly-recommended": true,
      "plugin:vue/vue3-recommended": true,
    },
    globals: {
      useI18n: true,
    },
    // },
    // {
    //   ...
  }
);
