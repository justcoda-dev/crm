export const requestFiltersCreator = <T>(keyValue: T, filterProp: string) => {
  if (Array.isArray(keyValue)) {
    return keyValue
      .map((value, i) => {
        if (i) {
          return `&filters[${filterProp}]=${value}`;
        } else {
          return `filters[${filterProp}]=${value}`;
        }
      })
      .join("");
  } else {
    return `filters[${filterProp}]=${keyValue}`;
  }
};
