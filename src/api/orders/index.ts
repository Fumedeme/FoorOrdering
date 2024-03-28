import { supabase } from "@/lib/supabase";
import { useAuth } from "@/provider/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//Fetch all the orders, only for admins
export const useAdminOrderList = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*");
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
        .eq("user_id", id);
      if (error) throw new Error(error.message);
      return data;
    },
  });
};
