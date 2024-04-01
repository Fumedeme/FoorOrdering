import { CartItem, InsertTables } from "@/types";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { randomUUID } from "expo-crypto";
import { Tables } from "@/database.types";
import { useInsertOrder } from "@/api/orders";
import { router } from "expo-router";
import { useInsertOrderItems } from "@/api/orderItems";

type Product = Tables<"products">;

//Create type for all the cart
export type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem["size"]) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: () => void;
};

//Creating a context that will hold the variables
const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  //The state that will keep and set the data in our context
  const [items, setItems] = useState<CartItem[]>([]);

  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

  //Function that will create net item and add it into our context
  const addItem = (product: Product, size: CartItem["size"]) => {
    //İf the item is already there, update the existing one
    const existingItem = items.find(
      (item) => item.product === product && item.size === size
    );

    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    //If not, create a new item
    const newCartItem: CartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };

    setItems([newCartItem, ...items]);
  };

  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    setItems(
      items
        .map((item) =>
          item.id !== itemId
            ? item
            : { ...item, quantity: item.quantity + amount }
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = items.reduce(
    (sum, item) => (sum += item.product.price * item.quantity),
    0
  );

  const clearCart = () => {
    setItems([]);
  };

  const checkout = () => {
    insertOrder(
      { total },
      {
        onSuccess: saveOrderItems,
      }
    );
  };

  const saveOrderItems = (order: InsertTables<"orders">) => {
    const orderItems = items.map((item) => ({
      order_id: order.id!,
      product_id: item.product_id,
      quantity: item.quantity,
      size: item.size,
    }));

    insertOrderItems(orderItems, {
      onSuccess: () => {
        clearCart();
        //TODO: Workaroud for expo router not closing modal automatically issue
        router.dismissAll();
        setTimeout(() => {
          router.push(`/(user)/orders/${order.id}`);
        }, 0);
      },
    });
  };

  //Wrapper for our provider
  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, total, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

//Create a custom hook for hour context
export const useCart = () => useContext(CartContext);
