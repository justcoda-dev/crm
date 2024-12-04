export const requestFiltersCreator = <T>(
  valuesArr: T[],
  filterProp: string
) => {
  return valuesArr
    .map((value, i) => {
      if (i) {
        return `&filters[${filterProp}]=${value}`;
      } else {
        return `filters[${filterProp}]=${value}`;
      }
    })
    .join("");
};
