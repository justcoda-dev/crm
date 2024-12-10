<template>
  <v-theme-provider>
    <v-app>
      <Header v-if="user" :user="user" :headerMenuList="headerMenuList" />
      <v-main class="bg-grey-lighten-5">
        <slot />

        <Dialog v-model="dialog.dialogState.value">
          <component
            :is="dialog.component.value"
            v-bind="dialog.componentProps.value"
            v-on="dialog.componentEvents.value"
          ></component>
        </Dialog>
        <Status
          v-model="status.statusState.value"
          v-bind="status.statusProps.value"
        >
        </Status>
      </v-main>
    </v-app>
  </v-theme-provider>
</template>
<script lang="ts" setup>
import Status from "~/components/dialog/Status.vue";
import { useDialog } from "~/composable/useDialog";
import { useStatus } from "~/composable/useStatus";
import { useMyUserStore } from "~/store/user";

const userStore = useMyUserStore();
const dialog = useDialog();
const status = useStatus();
const { user } = storeToRefs(userStore);

await userStore.getUser();

const headerMenuList = ref([
  {
    id: 1,
    path: "/costumers-list",
    title: "menuItem.costumers-list",
    iconName: "mdi-account",
    type: "list-item",
  },
  {
    id: 2,
    path: "/options",
    title: "menuItem.options",
    iconName: "mdi-cog",
    type: "list-item",
  },

  {
    id: 3,
    path: "/reports",
    title: "menuItem.reports",
    iconName: "mdi-book-multiple",
    type: "list-item",
  },
]);
</script>
<style scoped></style>
