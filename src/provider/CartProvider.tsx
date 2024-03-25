import { CartItem, Product } from "@/types";
import { PropsWithChildren, createContext, useContext, useState } from "react";

//Create type for all the cart
export type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem["size"]) => void;
};

//Creating a context that will hold the variables
const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  //The state that will keep and set the data in our context
  const [items, setItems] = useState<CartItem[]>([]);

  //Function that will create net item and add it into our context
  const addItem = (product: Product, size: CartItem["size"]) => {
    const newCartItem: CartItem = {
      id: "1",
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };

    setItems([newCartItem, ...items]);
  };

  //Wrapper for our provider
  return (
    <CartContext.Provider value={{ items, addItem }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

//Create a custom hook for hour context
export const useCart = () => useContext(CartContext);
