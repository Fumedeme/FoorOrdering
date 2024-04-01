import { supabase } from "@/lib/supabase";
import { useAuth } from "@/provider/AuthProvider";
import { InsertTables, Tables } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type AdminOrderListProps = {
  archived: boolean;
};

//Fetch all the orders, only for admins
export const useAdminOrderList = ({ archived }: AdminOrderListProps) => {
  const statues = archived ? ["Delivered"] : ["New", "Cooking", "Delivering"];
  return useQuery({
    queryKey: ["orders", archived],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", statues)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

//Fetch all the orders of a specific user depending on user_id
export const useMyOrderList = () => {
  const { session } = useAuth();
  const id = session?.user.id;

  return useQuery({
    queryKey: ["orders", { userId: id }],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", id)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

//Fetch only one order with given id
export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("id", id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
  });
};

//Create a new order
export const useInsertOrder = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: InsertTables<"orders">) {
      const { data: newOrder, error } = await supabase
        .from("orders")
        .insert({ ...data, user_id: userId })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return newOrder;
    },
    //Function that will refresh products list after a succesful creation
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

//Update an existing product
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: Tables<"orders">;
    }) {
      const { data: updatedOrder, error } = await supabase
        .from("products")
        .update(updatedFields)
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return updatedOrder;
    },
    //Function that will refresh products list and the specific product after a succesful creation
    async onSuccess(_, data) {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({ queryKey: ["orders", data.id] });
    },
  });
};
