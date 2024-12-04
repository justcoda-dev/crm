import type { ICostumer, ICostumerData, ICostumersData } from "~/TS/ICostumer";
import type { ICalendarDates } from "~/TS/ICalendarDate";
import type { ID } from "~/TS/myTypes";
import type { IHotel } from "~/TS/IHotel";
export interface ICreateingCalendarDate {
  start: string;
  end: string;
  filter_date: string;
  total_price: number;
  daysCount: number;
  hotel?: ID;
  enterprice?: ID;
}
export const useCreateCostumerForm = () => {
  const app = useNuxtApp();
  const showForm = ref(false);
  const selectedDates = ref();

  const onCancelForm = () => {
    showForm.value = false;
  };
  // перерробити на простий пат зарос, і передавати юзера з форми данні
  const onSubmitForm = async (formDataCostumer: {
    name: string;
    phone: string;
    costumerFromDb: boolean;
    user: ID;
    costumerId: ID;
    hotel: ID;
    id: ID;
    enterprise: ID;
  }) => {
    console.log(formDataCostumer);
    showForm.value = false;
    try {
      console.log(selectedDates.value, formDataCostumer);
      const { data: calendarDates } = await app.$apiFetch<ICalendarDates>(
        "/calendar-dates",
        {
          method: "POST",
          body: {
            data: {
              ...selectedDates.value,
              user: formDataCostumer.user,
              hotel: formDataCostumer.hotel,
            },
          },
        }
      );

      if (formDataCostumer.costumerFromDb) {
        const { data: costumerFromDb } = await app.$apiFetch<ICostumerData>(
          `costumers/${formDataCostumer.id}?populate=*`
        );

        await app.$apiFetch<ICostumersData>(
          `/costumers/${formDataCostumer.id}`,
          {
            method: "PUT",
            body: {
              data: {
                name: formDataCostumer.name,
                phone: formDataCostumer.phone,
                hotels: costumerFromDb.hotels.every(
                  (hotel: { id: ID }) => hotel.id !== formDataCostumer.hotel
                )
                  ? [...costumerFromDb.hotels, formDataCostumer.hotel]
                  : [...costumerFromDb.hotels],
                user: formDataCostumer.user,
                calendar_dates: [
                  ...costumerFromDb.calendar_dates,
                  calendarDates.id,
                ],
              },
            },
          }
        );
      } else {
        await app.$apiFetch<ICostumersData>("/costumers", {
          method: "POST",
          body: {
            data: {
              ...formDataCostumer,
              hotels: formDataCostumer.hotel,
              user: formDataCostumer.user,
              calendar_dates: calendarDates.id,
            },
          },
        });
      }
    } catch (e) {
      console.error("user create form error", e);
    }
  };

  const onShowForm = (date: ICreateingCalendarDate) => {
    console.log(date);
    selectedDates.value = toValue(date);
    showForm.value = true;
  };

  return { selectedDates, showForm, onCancelForm, onSubmitForm, onShowForm };
};
