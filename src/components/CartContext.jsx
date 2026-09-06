import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  function addToCart(product) {
    if (Number(product.stock) <= 0) {
      alert("Sorry, this product is out of stock.");
      return;
    }

    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        if (
          existingProduct.quantity >=
          Number(product.stock)
        ) {
          alert(
            `Only ${product.stock} items available in stock.`
          );

          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                stock: product.stock,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId
      )
    );
  }

  function increaseQuantity(productId) {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        if (item.quantity >= Number(item.stock)) {
          alert(
            `Only ${item.stock} items available in stock.`
          );

          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  }

  function decreaseQuantity(productId) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}