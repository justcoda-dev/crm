export const fullDateConvertor = (fullDate: string) => {
  const date = new Date(fullDate);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};
