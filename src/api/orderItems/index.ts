import { supabase } from "@/lib/supabase";
import { useAuth } from "@/provider/AuthProvider";
import { InsertTables } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//Create a new order
export const useInsertOrderItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: InsertTables<"order_items">[]) {
      const { data: newOrder, error } = await supabase
        .from("order_items")
        .insert(data)
        .select();
      if (error) throw new Error(error.message);
      return newOrder;
    },
  });
};
