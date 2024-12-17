const statusState = ref<boolean>(false);
const statusProps = ref();
export const useStatus = () => {
  const showStatus = (status: {
    status: string;
    type?: "error" | "success" | "message";
    timeout?: number;
    location?: "top" | "bottom";
  }) => {
    statusState.value = true;
    statusProps.value = status;
  };
  const hideStatus = () => {
    statusState.value = false;
    statusProps.value = {
      status: "",
    };
  };
  return {
    showStatus,
    hideStatus,
    statusState,
    statusProps,
  };
};
