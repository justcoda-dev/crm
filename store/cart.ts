import { defineStore } from "pinia";
export const useMyCartStore = defineStore("myCartStore", () => {
  const counter = ref(0);
  const auth = ref(false);
  const increment = () => {};
  const decrement = () => {};
  return { increment, decrement, counter, auth };
});
