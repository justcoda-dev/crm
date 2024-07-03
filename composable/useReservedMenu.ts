export const useMobileMenu = (id: number) => {
  const showForm = ref(false);
  const onDelete = async (id: number) => {
    try {
      const { data }: any = await app.$apiFetch(`/calendar-dates/${id}`, {
        method: "DELETE",
      });
      if (data.id) {
      }
    } catch (e) {
      console.error(e);
    }
  };
  const onEdit = () => {};
  const onCancel = () => {
    showForm.value = false;
  };
  return { showForm, onDelete, onEdit, onCancel };
};
