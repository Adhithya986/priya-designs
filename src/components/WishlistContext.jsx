import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("priyaWishlist");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load wishlist from storage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("priyaWishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist to storage", e);
    }
  }, [wishlist]);

  function addToWishlist(product) {
    const productId = String(product._id || product.id);

    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some(
        (item) => String(item._id || item.id) === productId
      );

      if (exists) {
        return currentWishlist;
      }

      return [
        ...currentWishlist,
        {
          ...product,
          id: productId,
          _id: productId,
        },
      ];
    });
  }

  function removeFromWishlist(productId) {
    const pid = String(productId);
    setWishlist((currentWishlist) =>
      currentWishlist.filter(
        (item) => String(item._id || item.id) !== pid
      )
    );
  }

  function toggleWishlist(product) {
    const productId = String(product._id || product.id);

    setWishlist((currentWishlist) => {
      const exists = currentWishlist.some(
        (item) => String(item._id || item.id) === productId
      );

      if (exists) {
        return currentWishlist.filter(
          (item) => String(item._id || item.id) !== productId
        );
      }

      return [
        ...currentWishlist,
        {
          ...product,
          id: productId,
          _id: productId,
        },
      ];
    });
  }

  function isInWishlist(productId) {
    if (!productId) return false;
    const pid = String(productId._id || productId.id || productId);
    return wishlist.some(
      (item) => String(item._id || item.id) === pid
    );
  }

  const wishlistCount = wishlist.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}