import type { ID } from "~/TS/myTypes";
export const useEditCostumerForm = () => {
  const app = useNuxtApp();
  const editCostumer = ref({});
  const showForm = ref(false);

  const onShowForm = (costumer: { id: ID; name: string; phone: string }) => {
    editCostumer.value = toValue(costumer);
    showForm.value = true;
  };

  const onSubmit = async (formCostumer: {
    name: string;
    phone: string;
    id: ID;
  }) => {
    const formEditedCostumer = toValue(formCostumer);
    await app.$apiFetch(`costumers/${formEditedCostumer.id}`, {
      method: "PUT",
      body: {
        data: formEditedCostumer,
      },
    });
    showForm.value = false;
  };

  const onCancelEdit = () => {
    showForm.value = false;
  };
  return { showForm, editCostumer, onShowForm, onSubmit, onCancelEdit };
};
