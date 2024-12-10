import type { ICostumerCreate, ICostumerUpdate } from "~/TS/ICostumer";
export const useCreateCostumerForm = () => {
  const app = useNuxtApp();
  const formState = ref(false);
  const loading = ref(false);

  const hideForm = () => {
    formState.value = false;
  };
  const showForm = () => {
    formState.value = true;
  };

  const createCostumer = async (costumerData: ICostumerCreate) => {
    loading.value = true;
    const { id, ...formDataNewCostumer } = costumerData;
    try {
      if (costumerData.costumer_from_db) {
        const constumerFromDb = await app.$costumerService.getCostumerById(id);
        loading.value = false;
        return constumerFromDb;
      } else {
        const costumerFromDb = await app.$costumerService.postCostumer(
          formDataNewCostumer
        );
        loading.value = false;
        return costumerFromDb;
      }
    } catch (error) {
      console.error("user create form error", error);
      loading.value = false;
      throw error;
    }
  };
  const addRelationsToCostumer = async (
    updateCostumerData: ICostumerUpdate
  ) => {
    try {
      if (updateCostumerData.id) {
        loading.value = true;
        const data = await app.$costumerService.updateCostumerById(
          updateCostumerData
        );
        loading.value = false;
        return data;
      }
    } catch (error) {
      console.error("add relations costumer error", error);
      loading.value = false;
      throw error;
    }
  };

  return {
    showForm,
    hideForm,
    createCostumer,
    addRelationsToCostumer,
    loading,
    formState,
  };
};
