<template>
  <v-theme-provider>
    <v-app>
      <Header :user="user" :headerMenuList="headerMenuList" />
      <v-main class="bg-grey-lighten-5">
        <slot />
      </v-main>
    </v-app>
  </v-theme-provider>
</template>
<script lang="ts" setup>
import { useMyUserStore } from "~/store/user";
const store = useMyUserStore();
const { user } = storeToRefs(store);

const headerMenuList = ref([
  {
    id: 1,
    path: "/calendar",
    title: "menuItem.calendar",
    iconName: "mdi-view-dashboard",
  },
  {
    id: 2,
    path: "/costumers-list",
    title: "menuItem.costumers-list",
    iconName: "mdi-view-dashboard",
  },
  {
    id: 3,
    path: "/options",
    title: "menuItem.options",
    iconName: "mdi-view-dashboard",
  },
]);

await store.getUser();
</script>
<style scoped></style>
