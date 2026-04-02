import { useQuery } from "@tanstack/react-query";
import { fetchItems } from "../api/grocery.api";

export const useItems = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: fetchItems,
  });
};