import { defineStore } from "pinia";

export const useMyMobileStore = defineStore("myMobileStore", () => {
  const mobile = ref(false);
  const mobileWidth = 600;
  const checkViewPort = () => {
    const debouncedFn = _debounce((event) => {
      if (window.innerWidth < mobileWidth) {
        mobile.value = true;
      } else {
        mobile.value = false;
      }
    }, 200);

    if (window.innerWidth < mobileWidth) {
      mobile.value = true;
    } else {
      mobile.value = false;
    }
    window.addEventListener("resize", debouncedFn);
  };
  return { mobile, checkViewPort };
});
