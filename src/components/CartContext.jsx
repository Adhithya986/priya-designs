import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("priyaCart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cart from storage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("priyaCart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to storage", e);
    }
  }, [cart]);

  function addToCart(product, size = "2.6") {
    if (Number(product.stock) <= 0) {
      alert("Sorry, this product is out of stock.");
      return;
    }

    const productId = String(product._id || product.id);
    const chosenSize = size || product.size || "2.6";

    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) =>
          String(item._id || item.id) === productId &&
          (item.size || "2.6") === chosenSize
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
          String(item._id || item.id) === productId &&
          (item.size || "2.6") === chosenSize
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
          id: productId,
          _id: productId,
          size: chosenSize,
          quantity: 1,
        },
      ];
    });
  }

  function updateItemSize(itemId, newSize) {
    const idStr = String(itemId);
    setCart((currentCart) =>
      currentCart.map((item) =>
        String(item.id || item._id) === idStr
          ? { ...item, size: newSize }
          : item
      )
    );
  }

  function removeFromCart(productId) {
    const pid = String(productId);
    setCart((currentCart) =>
      currentCart.filter(
        (item) => String(item._id || item.id) !== pid
      )
    );
  }

  function clearCart() {
    setCart([]);
    try {
      localStorage.removeItem("priyaCart");
    } catch (e) {
      console.error(e);
    }
  }

  function increaseQuantity(productId) {
    const pid = String(productId);
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (String(item._id || item.id) !== pid) {
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
    const pid = String(productId);
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          String(item._id || item.id) === pid
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
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        cartCount,
        cartTotal,
        updateItemSize,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}