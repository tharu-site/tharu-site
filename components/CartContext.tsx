"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (item: CartItem) => void;

  removeFromCart: (id: string) => void;

  increaseQuantity: (id: string) => void;

  decreaseQuantity: (id: string) => void;

  updateQuantity: (
    id: string,
    quantity: number
  ) => void;

  clearCart: () => void;
};

const CartContext =
  createContext<CartContextType | null>(null);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [cart, setCart] = useState<CartItem[]>([]);

  /* LOAD CART FROM LOCAL STORAGE */
  useEffect(() => {

    const storedCart =
      localStorage.getItem("tharu-cart");

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

  }, []);

  /* SAVE CART TO LOCAL STORAGE */
  useEffect(() => {

    localStorage.setItem(
      "tharu-cart",
      JSON.stringify(cart)
    );

  }, [cart]);

  /* ADD TO CART */
  const addToCart = (item: CartItem) => {

    setCart((prev) => {

      const existing = prev.find(
        (p) => p.id === item.id
      );

      if (existing) {

        return prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                quantity:
                  p.quantity + item.quantity,
              }
            : p
        );
      }

      return [...prev, item];
    });
  };

  /* REMOVE */
  const removeFromCart = (id: string) => {

    setCart((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  };

  /* INCREASE */
  const increaseQuantity = (
    id: string
  ) => {

    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  /* DECREASE */
  const decreaseQuantity = (
    id: string
  ) => {

    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  /* UPDATE QUANTITY */
  const updateQuantity = (
    id: string,
    quantity: number
  ) => {

    if (quantity < 1) return;

    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  /* CLEAR CART */
  const clearCart = () => {

    setCart([]);

    localStorage.removeItem(
      "tharu-cart"
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {

  const context =
    useContext(CartContext);

  if (!context) {

    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}