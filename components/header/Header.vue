<template>
  <v-app-bar v-if="userStore.user">
    <v-app-bar-nav-icon variant="text" @click.stop="onMenuToggle" />
    <v-toolbar-title>
      <nuxt-link to="/">{{ $t("mainTitle") }}</nuxt-link>
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
      <v-list-group value="Hotels" prepend-icon="mdi-home-silo">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :title="$t('menuItem.hotels')"
          ></v-list-item>
        </template>
        <v-list-item prepend-icon="mdi-plus" @click="onCreateHotel"
          >create hotel</v-list-item
        >
        <template v-for="hotel of hotels" :key="hotel.id">
          <v-list-item prepend-icon="mdi-bed" @click="onHotelCkick(hotel.id)">
            {{ hotel.name }}
          </v-list-item>
        </template>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useDialog } from "~/composable/useDialog";
import { useStatus } from "~/composable/useStatus";
import { useMyAuthStore } from "~/store/auth";
import type { IHotel, IHotelCreate, IHotelsData } from "~/TS/IHotel";
import type { IUser } from "~/TS/IUser";
import type { ID } from "~/TS/myTypes";
import CreateHotelForm from "../forms/CreateHotelForm.vue";
import { useMyUserStore } from "~/store/user";
import { useForm } from "~/composable/useForm";

interface MenuItem {
  id: ID;
  title: string;
  path: string;
  iconName: string;
}

interface IProps {
  headerMenuList: MenuItem[];
}

const app = useNuxtApp();
const props = defineProps<IProps>();
const authStore = useMyAuthStore();
const userStore = useMyUserStore();
console.log(userStore);
const router = useRouter();
const route = useRoute();
const dialog = useDialog();
const status = useStatus();
const { submitForm } = useForm(app.$hotelService);
const menuToggle = ref(false);

const { data: hotels, refresh: refreshHotels } = await useAsyncData(() =>
  app.$hotelService.getDataByFilter(userStore.user.id, "users")
);

const username = computed(() => userStore.user?.username);

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
const onCreateHotel = () => {
  menuToggle.value = false;
  dialog.showComponent({
    componentToShow: defineAsyncComponent(
      () => import("@/components/forms/CreateHotelForm.vue")
    ),
    props: {},
    events: {
      onSubmit: async (formData: { name: string; location: string }) => {
        try {
          const enterprise = userStore.userEnterprise;
          const users = await app.$userService.getDataByFilter(
            enterprise.id,
            "enterprise"
          );
          console.log(users);

          const hotel = await submitForm({ ...formData, enterprise, users });
          dialog.hideComponent();
          status.showStatus({
            status: `Готель ${hotel.name} успішно створено`,
            type: "success",
          });
          refreshHotels();
        } catch (error) {
          console.error(error);
          status.showStatus({
            status: "При створенні готелю виникла помилка :(",
            type: "error",
          });
          dialog.hideComponent();
        }
      },
      onCancel: () => {
        dialog.hideComponent();
      },
    },
  });
};
const logoutApp = () => {
  authStore.logout();
  navigateTo("/authorization");
};

const onMenuToggle = () => (menuToggle.value = !menuToggle.value);
</script>

<style scoped></style>
