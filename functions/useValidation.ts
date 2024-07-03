export const useValidation = <T>(
  initialModel: T,
  instructions: Array<{ prop: string; rules: any[] }>
) => {
  const model = ref<T>(toValue(initialModel));
  const errorMessages = ref({});
  const modelPropertyHasCome = ref({});
  const haveErrors = ref(false);
  watch(
    () => model,
    (modelProperty: any) => {
      if (instructions?.length) {
        instructions.forEach((instruction: { prop: string; rules: any[] }) => {
          if (
            modelProperty.value[instruction.prop]?.length ||
            modelPropertyHasCome.value[instruction.prop]
          ) {
            modelPropertyHasCome.value[instruction.prop] = true;
            const messages = instruction.rules.map((rule) => {
              const status = rule.fn(modelProperty.value[instruction.prop]);
              if (status) {
                return null;
              } else {
                return rule.errorMessage;
              }
            });
            const filtredMessages = messages.filter(
              (message) => message !== null
            );
            errorMessages.value[instruction.prop] = filtredMessages;
          } else {
            errorMessages.value[instruction.prop] = [];
            modelPropertyHasCome.value[instruction.prop] = false;
          }
        });

        const modelPropertiesHasComeStatus = Object.values(
          modelPropertyHasCome.value
        ).every((status) => status);

        const haveSomeErrorsStatus = Object.values(errorMessages.value).some(
          (arr: any): boolean => !!arr.length
        );

        if (modelPropertiesHasComeStatus && haveSomeErrorsStatus) {
          haveErrors.value = true;
        } else {
          haveErrors.value = false;
        }
      }
    },
    {
      deep: true,
    }
  );

  return { model, errorMessages, haveErrors };
};
