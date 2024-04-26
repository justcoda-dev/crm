<template>
  <v-container class="calendar-container">
    <custom-calendar
        @selectDate="onSelectDate"
        @changeMonth="onChangeMonth"
        :calendarList="mapCalendarDates"
        :currentPrice="mapCurrentPrice"
    >
      <template #menu-reserved="{attribute}">
        <menu-calendar-reserved
            :attribute="attribute"
            @delete="onDeleteReservedMenu"
            @edit="onEditReservedMenu"
        />
      </template>
    </custom-calendar>
    <v-dialog v-model="showCreateCostumerForm">
      <v-card class="pa-4">
        <template #title>
          {{ $t('title.create-user') }}
        </template>
        <create-costumer-form
            @keyup.esc="onCancelCostumerCreateForm"
            @cancelCLick="onCancelCostumerCreateForm"
            @submitForm="onSubmitCreateForm"
        />
      </v-card>
    </v-dialog>
    <v-dialog v-model="showEditCostumerForm">
      <v-card class="pa-4">
        <template #title>
          {{ $t('title.edit-user') }}
        </template>
        <edit-costumer-form
            :editCostumer="editCostumer"
            @keyup.esc="onCancelCostumerEditForm"
            @cancelCLick="onCancelCostumerEditForm"
            @submitForm="onSubmitCostumerEditForm"
        />
      </v-card>
    </v-dialog>
  </v-container>

</template>
<script lang="ts" setup>
import CustomCalendar from "../../components/calendar/CustomCalendar.vue";
import CreateCostumerForm from "../../components/forms/CreateCostumerForm.vue";
import MenuCalendarReserved from "../../components/menus/MenuCalendarReserved.vue";
import MenuCalendarCreate from "../../components/menus/MenuCalendarCreate.vue";
import EditCostumerForm from "../../components/forms/EditCostumerForm.vue";

const {public: {apiBase}} = useRuntimeConfig()

const createCalendarMonthInitial = () => {
  const date = new Date()
  const month = date.getMonth() + 1
  const fullYear = date.getFullYear()
  return `${fullYear}-${month < 10 ? '0' + month : month}`
}

const showCreateCostumerForm = ref(false)
const showEditCostumerForm = ref(false)
const selectedDates = ref({})
const calendarMonth = ref(createCalendarMonthInitial())
const editCostumer = ref({})
const {
  data: calendarDatesFromDb,
  refresh: refreshCalendarDatesFromDb,
} = await useFetch(() =>
    `${apiBase}/calendar-dates?populate=*&filters[filter_date][$startsWith]=${calendarMonth.value}`)

const {
  data: currentPriceFromDb,
  refresh: refreshCurrentPriceFromDb
} = await useFetch(() => `${apiBase}/current-price`)

const mapCurrentPrice = computed(() => {
  return {
    weekdaysPrice: currentPriceFromDb.value?.data?.attributes?.weekdays_price,
    weekendsPrice: currentPriceFromDb.value?.data?.attributes?.weekends_price
  }
})

const mapCalendarDates = computed(() => {
  return calendarDatesFromDb.value?.data?.map(date => {
    return {
      key: date.id,
      dates: {
        start: date.attributes?.start,
        end: date.attributes?.end,
      },
      customData: {...date.attributes?.costumer?.data, total_price: date.attributes?.total_price}
    }
  })
})

const onSubmitCreateForm = async (formData: object) => {
  showCreateCostumerForm.value = false
  if (formData.userFromDb) {
    const {data: calendarDates} = await useFetch(`${apiBase}/calendar-dates`, {
      method: "POST",
      body: {data: selectedDates.value}
    })
    const {data: userFromDbWithDates} = await useFetch(`${apiBase}/costumers/${formData.userId}?populate=*`)

    const responseCostumers = await useFetch(`${apiBase}/costumers/${formData.userId}`, {
      method: "PUT",
      body: {
        data: {
          name: formData.name?.title,
          phone: formData.phone,
          calendar_dates: [calendarDates.value?.data, ...userFromDbWithDates.value?.data?.attributes?.calendar_dates?.data]
        }
      }
    })

  } else {

    const {data: calendarDates} = await useFetch(`${apiBase}/calendar-dates`, {
      method: "POST",
      body: {data: selectedDates.value}
    })

    const responseCostumers = await useFetch(`${apiBase}/costumers`, {
      method: "POST",
      body: {
        data: {
          ...formData, calendar_dates: calendarDates.value?.data.id
        }
      }
    })
  }
  refreshCalendarDatesFromDb()
}
const onCancelCostumerCreateForm = () => {
  showCreateCostumerForm.value = false
}

const onEditReservedMenu = (costumer: object) => {
  editCostumer.value = costumer
  showEditCostumerForm.value = true
}

const onSubmitCostumerEditForm = async (formData: object) => {
  const responseCostumers = await useFetch(`${apiBase}/costumers/${formData.userId}`, {
    method: "PUT",
    body: {
      data: {
        name: formData.name,
        phone: formData.phone,
      }
    }
  })
  showEditCostumerForm.value = false
  refreshCalendarDatesFromDb()
}

const onCancelCostumerEditForm = () => {
  showEditCostumerForm.value = false
}
const onSelectDate = (data: object) => {
  selectedDates.value = data
  showCreateCostumerForm.value = true
}

const onChangeMonth = (month: object) => {
  calendarMonth.value = month.id
  console.log(month.id)
}

const onDeleteReservedMenu = async (id: number) => {
  try {
    const {data} = await $fetch(`${apiBase}/calendar-dates/${id}`, {method: "DELETE"})
    if (data.id) {
      refreshCalendarDatesFromDb()
    }
  } catch (e) {
    console.error("calendar reserved menu error", e)
  }
}

</script>

<style lang="scss" scoped>
.calendar-container {
  padding: 10px 16px;
}
</style>