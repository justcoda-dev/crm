import type { ICostumerData, ICostumers } from "~/TS/ICostumer";
import type { ICalendarDateData, ICalendarDates } from "~/TS/ICalendarDate";
import type { ID } from "~/TS/myTypes";
export const useCreateCostumerForm = () => {
  const app = useNuxtApp();
  const showForm = ref(false);
  const selectedDates = ref();

  const onCancelForm = () => {
    showForm.value = false;
  };

  const onSubmitForm = async (formData: {
    name: string;
    phone: string;
    userFromDb: boolean;
    userId: ID;
    user: any;
  }) => {
    showForm.value = false;
    if (formData.userFromDb) {
      try {
        const [calendarDates, costumerFromDbWithDates] = await Promise.all([
          app.$apiFetch<ICalendarDates>("/calendar-dates", {
            method: "POST",
            body: {
              data: {
                ...selectedDates.value,
              },
            },
          }),
          app.$apiFetch<ICostumerData>(
            `/costumers/${formData.userId}?populate=*`
          ),
        ]);

        await app.$apiFetch<ICostumers>(`/costumers/${formData.userId}`, {
          method: "PUT",
          body: {
            data: {
              name: formData.name,
              phone: formData.phone,
              calendar_dates: [
                calendarDates.data,
                ...costumerFromDbWithDates.data.attributes.calendar_dates.data,
              ],
            },
          },
        });
        
        const response = await app.$apiFetch(`/users/${formData.user.id}`, {
          method: "PUT",
          body: {
            calendar_dates: calendarDates.data.id,
          },
        });
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        const calendarDates = await app.$apiFetch<ICalendarDateData>(
          "/calendar-dates",
          {
            method: "POST",
            body: {
              data: {
                ...selectedDates.value,
              },
            },
          }
        );
        const costumer = await app.$apiFetch<ICostumers>("/costumers", {
          method: "POST",
          body: {
            data: {
              ...formData,
              calendar_dates: calendarDates?.data.id,
            },
          },
        });

        const response = await app.$apiFetch(`/users/${formData.user.id}`, {
          method: "PUT",
          body: {
            costumers: costumer.data.id,
            calendar_dates: calendarDates.data.id,
          },
        });

        console.log(costumer);
        console.log(response);
        console.log(calendarDates.data);
      } catch (e) {}
    }
  };
  const onShowForm = (date: {
    start: string;
    end: string;
    filter_date: string;
    total_price: number;
    daysCount: number;
    days: number[];
  }) => {
    selectedDates.value = toValue(date);
    showForm.value = true;
  };

  return { selectedDates, showForm, onCancelForm, onSubmitForm, onShowForm };
};
