<template>
  <v-container class="py-4">
    <v-row :class="{ 'flex-column': mobile }">
      <v-col>
        <v-text-field
          append-inner-icon="mdi-magnify"
          v-model="search"
          :label="$t('text-field.search')"
        />
      </v-col>
      <v-col>
        <v-btn :disabled="!selected.length" @click="onDeleteCostumer">{{
          $t("button-delete")
        }}</v-btn>
        <v-btn @click="onCreateCostumerForm">{{
          $t("button-create.new-costumer")
        }}</v-btn>
      </v-col>
    </v-row>
    <costumers-table
      v-model:selected="selected"
      :search="search"
      :costumersList="costumersList"
    />
  </v-container>
</template>

<script lang="ts" setup>
import CreateCostumerForm from "~/components/forms/CreateCostumerForm.vue";
import { useDialog } from "~/composable/useDialog";
import CostumersTable from "../../components/tables/CostumersTable.vue";
import { useMyMobileStore } from "~/store/mobile";
import { useMyUserStore } from "~/store/user";
import type { ICalendarDateFromDb } from "~/TS/ICalendarDate";

import { useStatus } from "~/composable/useStatus";
import type { ICostumerCreate } from "~/TS/ICostumer";
import ConfirmForm from "~/components/forms/ConfirmForm.vue";
import { useForm } from "~/composable/useForm";

const app = useNuxtApp();
const mobileStore = useMyMobileStore();
const userStore = useMyUserStore();

const dialog = useDialog();
const status = useStatus();
const createForm = useForm(app.$costumerService);

const { mobile } = storeToRefs(mobileStore);
const { userHotels, user } = storeToRefs(userStore);

const hotelIds = computed(() =>
  userHotels.value ? userHotels.value?.map((hotel) => hotel.id) : []
);
const { data: costumers, refresh: refreshCostumers } = useAsyncData(
  async () =>
    await app.$costumerService.getDataByFilter(hotelIds.value, "hotels")
);

const search = ref("");
const selected = ref<{ name: string; phone: "string"; id: number }[]>([]);
const reservedCostumerDates = ref<ICalendarDateFromDb[]>();

const costumersList = computed(() => {
  if (costumers.value) {
    return costumers.value;
  } else {
    return [];
  }
});
const onCreateCostumerForm = () => {
  dialog.showComponent({
    componentToShow: CreateCostumerForm,
    props: {},
    events: {
      submitClick: async (costumer: ICostumerCreate) => {
        try {
          if (user) {
            const createdCostumer = await createForm.submitForm(costumer);
            const createdCostumerWithRelation = await createForm.update(
              {
                ...createdCostumer,
                hotels: userHotels.value,
                user: user.value,
              },
              createdCostumer.id
            );
            console.log(createdCostumerWithRelation);
            status.showStatus({
              status: "Клієнта створено успішно",
              type: "success",
            });
            refreshCostumers();
          }
          dialog.hideComponent();
        } catch (error) {
          status.showStatus({
            status: "При створені клієнта слалась помилка :(",
            type: "error",
          });
        }
      },
      cancelClick: () => {
        dialog.hideComponent();
      },
    },
  });
};
const onDeleteCostumer = async () => {
  if (selected.value.length) {
    dialog.showComponent({
      componentToShow: ConfirmForm,
      props: {
        text:
          selected.value.length > 1
            ? `Будуть також видалені повязані дати. Видалити ${selected.value.length} користувачів ?`
            : `Будуть також видалені повязані дати. Видалити користувача ${selected.value[0]?.name}?`,
      },
      events: {
        onSubmit: async () => {
          try {
            const costumerIds = selected.value.map((costumer) => costumer.id);
            const { data: datesToDelete } =
              await app.$calendarDateService.getDataByFilter(
                costumerIds,
                "costumer"
              );

            await Promise.all(
              datesToDelete.value.data.map(
                async (date: ICalendarDateFromDb) =>
                  await app.$calendarDateService.deleteById(date.id)
              )
            );
            await Promise.all(
              selected.value.map(
                async (costumer) =>
                  await app.$costumerService.deleteById(costumer.id)
              )
            );

            dialog.hideComponent();
            refreshCostumers();
            status.showStatus({
              status: "Видалено успішно",
              type: "success",
            });
          } catch (error) {
            console.error(error);
            dialog.hideComponent();
            status.showStatus({
              status: "При видаленні сталсь помилка",
              type: "error",
            });
          }
        },
        onCancel: () => {
          dialog.hideComponent();
        },
      },
    });
  }
};
</script>

<style scoped></style>
