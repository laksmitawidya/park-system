import { OrderInfo } from "../utils/common-type";

export const useLocalStorage = (key = "") => {
  const setItem = (value = "") => {
    try {
      const currentData = JSON.parse(window.localStorage.getItem(key) || "[]");
      const updatedData = [...currentData, value];
      window.localStorage.setItem(key, JSON.stringify(updatedData));
    } catch (error) {
      console.error(error);
    }
  };

  const getItem = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as OrderInfo[]) : [];
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem = (selectedItem: OrderInfo) => {
    try {
      const currentData = JSON.parse(
        window.localStorage.getItem(key) || "[]"
      ) as OrderInfo[];

      const updatedData = currentData.filter(
        (data) => data.id !== selectedItem.id
      );

      window.localStorage.setItem(key, JSON.stringify(updatedData));
    } catch (error) {
      console.error(error);
    }
  };

  return { setItem, getItem, removeItem };
};
