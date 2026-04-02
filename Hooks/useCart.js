import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

let historyStack = [];

export const useCartData = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => {
      if (typeof window !== "undefined") {
        const data = localStorage.getItem("cart");
        return data ? JSON.parse(data) : [];
      }
      return [];
    },
    initialData: [],
  });
};

export const useCart = () => {
  const queryClient = useQueryClient();

  const updateStorage = (data) => {
    localStorage.setItem("cart", JSON.stringify(data));
  };

  const addItem = useMutation({
    mutationFn: async (item) => item,
    onSuccess: (item) => {
      const prev = queryClient.getQueryData(["cart"]) || [];
      historyStack.push(prev);

      const existing = prev.find((i) => i.id === item.id);

      let updated;

      if (existing) {
        updated = prev.map((i) =>
          i.id === item.id ? { ...i, qty: i.qty + 1 } : i
        );
      } else {
        updated = [...prev, { ...item, qty: 1 }];
      }

      queryClient.setQueryData(["cart"], updated);
      updateStorage(updated);
    },
  });

  const decreaseItem = (id) => {
    const prev = queryClient.getQueryData(["cart"])|| [];
    historyStack.push(prev);

    let updated = prev
      .map((i) =>
        i.id === id ? { ...i, qty: i.qty - 1 } : i
      )
      .filter((i) => i.qty > 0);

    queryClient.setQueryData(["cart"], updated);
    updateStorage(updated);
  };

  const undo = () => {
    const last = historyStack.pop();
    if (last) {
      queryClient.setQueryData(["cart"], last);
      updateStorage(last);
    }
  };

  return {
    addItem: addItem.mutate,
    decreaseItem,
    undo,
  };
};