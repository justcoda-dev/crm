import type { IService } from "~/TS/IService";
import type { ID } from "~/TS/myTypes";

export const useForm = (service: IService) => {
  const toggleState = ref(false);
  const loading = ref(false);
  const showForm = () => {
    toggleState.value = true;
  };
  const hideForm = () => {
    toggleState.value = false;
  };

  const submitForm = async (data: any) => {
    try {
      loading.value = true;
      const response = await service.postData(data);
      loading.value = false;
      hideForm();
      return response;
    } catch (error) {
      console.error(error);
      loading.value = false;
      hideForm();
      throw error;
    }
  };
  const update = async (data: any, id: ID) => {
    try {
      loading.value = true;
      const response = await service.updateDataById(id, data);
      loading.value = false;
      return response;
    } catch (error) {
      console.error(error);
      loading.value = false;
      throw error;
    }
  };
  const cancelForm = () => {
    toggleState.value = false;
  };
  return { toggleState, update, submitForm, hideForm, cancelForm, showForm };
};
