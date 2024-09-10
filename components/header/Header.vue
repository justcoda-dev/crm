<template>
  <v-app-bar>
    <v-app-bar-nav-icon variant="text" @click.stop="onMenuToggle" />
    <v-toolbar-title>
      <NuxtLink to="/">{{ $t("mainTitle") }}</NuxtLink>
    </v-toolbar-title>
    <v-spacer />
    <v-btn @click="logoutApp" icon="mdi-export" />
  </v-app-bar>
  <v-navigation-drawer v-model="menuToggle" temporary>
    <v-list-item class="my-3" :title="fullName" />
    <v-divider />
    <v-list nav>
      <template v-for="menuItem of props.headerMenuList">
        <NuxtLink :to="menuItem.path">
          <v-list-item
            :prepend-icon="menuItem.iconName"
            :title="$t(menuItem.title)"
          />
        </NuxtLink>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/auth";

interface MenuItem {
  id: string | number;
  title: string;
  path: string;
  iconName: string;
}

interface IProps {
  headerMenuList: MenuItem[];
  user: any;
}
const props = defineProps<IProps>();
const jwt = useCookie("jwt");
const authStore = useMyAuthStore();
const {
  public: { apiBase },
} = useRuntimeConfig();
const fullName = computed(() => {
  if (props.user?.name && props.user?.surname) {
    return `${props.user.name} ${props.user.surname}`;
  } else {
    return props.user?.username;
  }
});
const icon = computed(() => `${apiBase}${props.user?.icon?.url}`);

const logoutApp = () => {
  authStore.logout();
  navigateTo("/authorization");
};

const menuToggle = ref(false);
const onMenuToggle = () => (menuToggle.value = !menuToggle.value);
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: inherit;
}
</style>
