import React, { createContext, useContext, useMemo, useReducer } from "react";

const CartContext = createContext(null);

const initialState = {
  items: []
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };
    }
    case "UPDATE_QTY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.id !== id)
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        )
      };
    }
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = useMemo(
    () => ({
      items: state.items,
      addToCart: (product) => dispatch({ type: "ADD", payload: product }),
      updateQuantity: (id, quantity) =>
        dispatch({ type: "UPDATE_QTY", payload: { id, quantity } }),
      clearCart: () => dispatch({ type: "CLEAR" })
    }),
    [state]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

