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

const userStore = useMyUserStore();
const { user } = storeToRefs(userStore);
await userStore.getUser();

const headerMenuList = ref([
  {
    id: 1,
    path: "/costumers-list",
    title: "menuItem.costumers-list",
    iconName: "mdi-view-dashboard",
    type: "list-item",
  },
  {
    id: 2,
    path: "/options",
    title: "menuItem.options",
    iconName: "mdi-view-dashboard",
    type: "list-item",
  },

  {
    id: 3,
    path: "/reports",
    title: "menuItem.reports",
    iconName: "mdi-view-dashboard",
    type: "list-item",
  },
]);
</script>
<style scoped></style>
