import type { ID } from "~/TS/myTypes";
// export const requestFiltersCreator = <T>(keyValue: T, filterProp: string) => {
//   {
//   }
//   if (Array.isArray(keyValue)) {
//     return keyValue
//       .map((value, i) => {
//         if (i) {
//           return `&filters[${filterProp}]=${value}`;
//         } else {
//           return `filters[${filterProp}]=${value}`;
//         }
//       })
//       .join("");
//   } else {
//     return `filters[${filterProp}]=${keyValue}`;
//   }
// };
export const requestFiltersCreator = (obj: {
  [key: string]: ID | ID[] | string;
}) => {
  const filters = Object.keys(obj);
  let res = "";
  for (const [i, filter] of filters.entries()) {
    if (Array.isArray(obj[filter])) {
      const arr = obj[filter].map((id, index) => {
        if (index) {
          return `&filters[${filter}]=${id}`;
        } else {
          return `filters[${filter}]=${id}`;
        }
      });
      res += arr.join("");
    } else {
      if (i) {
        res += `&filters[${filter}]=${obj[filter]}`;
      } else {
        res += `filters[${filter}]=${obj[filter]}`;
      }
    }
  }

  return res;
};
