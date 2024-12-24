<template>
  <v-app-bar flat density="default" v-if="userStore.user">
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
    <v-list slim nav>
      <template v-for="menuItem of props.headerMenuList" :key="menuItem.id">
        <v-list-item
          color="primary"
          @click="onMenuItemClick(menuItem.path)"
          :value="menuItem.id"
          :prepend-icon="menuItem.iconName"
        >
          <template #title>
            <span class="text-subtitle-2"> {{ $t(menuItem.title) }}</span>
          </template>
        </v-list-item>
      </template>
      <v-list-group fluid slim prepend-icon="mdi-home-silo">
        <template #activator="{ props }">
          <v-list-item v-bind="props" color="primary">
            <template #title>
              <span class="text-subtitle-2"> {{ $t("menuItem.hotels") }}</span>
            </template>
          </v-list-item>
        </template>
        <v-list-item
          prepend-icon="mdi-plus"
          color="primary"
          :title="'create hotel'"
          @click="onCreateHotel"
        ></v-list-item>
        <template v-for="hotel of hotels" :key="hotel.id">
          <v-list-group prepend-icon="mdi-bed">
            <template #activator="{ props }">
              <v-list-item v-bind="props" color="primary" :title="hotel.name">
              </v-list-item>
            </template>
            <v-list-item
              prepend-icon="mdi-plus"
              color="primary"
              :title="'create hotel-room'"
              @click="onCreateHotelRoom(hotel.id)"
            ></v-list-item>
            <template
              v-for="hotelRoom of hotel.hotel_rooms"
              :key="hotelRoom.id"
            >
              <v-list-item
                v-bind="props"
                color="primary"
                :title="hotelRoom.name"
                :active="activeHotelRoomId === hotelRoom.id"
                @click="onHotelRoomClick(hotel.id, hotelRoom.id)"
              >
              </v-list-item>
            </template>
          </v-list-group>
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

const router = useRouter();
const route = useRoute();
const dialog = useDialog();
const status = useStatus();
const { submitForm: submitCreateHotelForm } = useForm(app.$hotelService);
const { submitForm: submitCreateHotelRoomForm } = useForm(
  app.$hotelRoomService
);
const menuToggle = ref(false);
const activeHotelRoomId = ref(null);
const { data: hotels, refresh: refreshHotels } = await useAsyncData(() =>
  app.$hotelService.getDataByFilter(userStore.user.id, "users")
);

const username = computed(() => userStore.user?.username);

const onMenuItemClick = (path: string) => {
  if (route.path === path) {
    menuToggle.value = false;
  } else {
    router.push(path);
    activeHotelRoomId.value = null;
  }
};

const onHotelRoomClick = (hotelId: ID, hotelRoomId: ID) => {
  activeHotelRoomId.value = hotelRoomId;
  router.push({
    name: "hotel-id",
    params: { id: hotelId },
    query: { hotelRoomId },
  });
};
const onCreateHotelRoom = (hotelId: ID) => {
  menuToggle.value = false;
  dialog.showComponent({
    componentToShow: defineAsyncComponent(
      () => import("@/components/forms/CreateHotelRoomForm.vue")
    ),
    props: {
      title: "Створити кімнату",
    },
    events: {
      onSubmit: async (formData: { name: string; location: string }) => {
        try {
          const enterprise = userStore.userEnterprise;
          // const users = await app.$userService.getDataByFilter(
          //   enterprise.id,
          //   "enterprise"
          // );

          const hotelRoom = await submitCreateHotelRoomForm({
            ...formData,
            hotel: hotelId,
          });
          dialog.hideComponent();
          status.showStatus({
            status: `Готельний номер ${hotelRoom.name} успішно створено`,
            type: "success",
          });
          refreshHotels();
        } catch (error) {
          console.error(error);
          status.showStatus({
            status: "При створенні готельного номеру виникла помилка :(",
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
          const users = await app.$userService.getDataByFilter({
            enterprise: enterprise.id,
          });

          const hotel = await submitCreateHotelForm({
            ...formData,
            enterprise,
            users,
          });
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
