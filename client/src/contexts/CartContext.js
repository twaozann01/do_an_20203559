import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("repairCart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("repairCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item) => {
    const cleanedItem = {
      ...item,
      orderDetails: item.orderDetails.map((od) => ({
        deviceDetailId: od.deviceDetailId,
        description: od.description,
        minPrice: od.minPrice,
        deviceDetailName: od.deviceDetailName,
      })),
    };
    setCartItems((prev) => [...prev, cleanedItem]);
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };
  const updateCartItem = (index, newItem) => {
    setCartItems((prev) =>
      prev.map((item, i) => (i === index ? newItem : item))
    );
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
