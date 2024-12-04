<template>
  <v-app-bar>
    <v-app-bar-nav-icon variant="text" @click.stop="onMenuToggle" />

    <v-toolbar-title>
      <NuxtLink to="/">{{ $t("mainTitle") }}</NuxtLink>
    </v-toolbar-title>
    <v-spacer />
    <v-btn icon="mdi-export" @click="logoutApp" />
  </v-app-bar>
  <v-navigation-drawer temporary v-model="menuToggle">
    <v-list-item class="my-3" :title="username" />
    <v-divider />
    <v-list nav>
      <template v-for="menuItem of props.headerMenuList" :key="menuItem.id">
        <v-list-item
          @click="onMenuItemClick(menuItem.path)"
          :prepend-icon="menuItem.iconName"
          :title="$t(menuItem.title)"
        />
      </template>
      <v-list-group value="Hotels" prepend-icon="mdi-view-dashboard">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :title="$t('menuItem.hotels')"
          ></v-list-item>
        </template>
        <v-list-item>+ create hotel</v-list-item>
        <template v-for="hotel of hotels" :key="hotel.id">
          <v-list-item @click="onHotelCkick(hotel.id)">
            {{ hotel.name }}
          </v-list-item>
        </template>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/auth";
import type { IHotelsData } from "~/TS/IHotel";
import type { IUser } from "~/TS/IUser";
import type { ID } from "~/TS/myTypes";

interface MenuItem {
  id: ID;
  title: string;
  path: string;
  iconName: string;
}

interface IProps {
  headerMenuList: MenuItem[];
  user: IUser;
}

const app = useNuxtApp();
const props = defineProps<IProps>();
const authStore = useMyAuthStore();
const router = useRouter();
const route = useRoute();
const menuToggle = ref(false);

const { data: hotels } = await app.$apiFetch<IHotelsData>(
  `/hotels?filters[users]=${props.user.id}&populate=*`
);
const username = computed(() => props.user.username);

const onMenuItemClick = (path: string) => {
  if (route.path === path) {
    menuToggle.value = false;
  } else {
    router.push(path);
  }
};
const onHotelCkick = (id: ID) => {
  router.push({ name: "hotel-id", params: { id } });
};

const logoutApp = () => {
  authStore.logout();
  navigateTo("/authorization");
};

const onMenuToggle = () => (menuToggle.value = !menuToggle.value);
</script>

<style scoped></style>
