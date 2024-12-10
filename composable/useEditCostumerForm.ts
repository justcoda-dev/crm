import type { ID } from "~/TS/myTypes";

export const useEditCostumerForm = () => {
  const app = useNuxtApp();
  const formState = ref(false);
  const costumer = ref();
  const loading = ref(false);

  const hideForm = () => {
    formState.value = false;
  };
  const showForm = () => {
    formState.value = true;
  };
  const updateCostumer = async (formDataCostumer: {
    name: string;
    phone: string;
    costumer_from_db: boolean;
    user: ID;
    hotels: ID;
    id: ID;
  }) => {
    try {
      if (formDataCostumer.costumer_from_db) {
        loading.value = true;
        const costumerFromDb = await app.$costumerService.updateCostumerById(
          formDataCostumer
        );
        costumer.value = costumerFromDb;
        loading.value = false;
        return costumerFromDb;
      }
    } catch (e) {
      console.error("user create form error", e);
      loading.value = false;
    }
    hideForm();
  };

  return { showForm, hideForm, updateCostumer, loading };
};
