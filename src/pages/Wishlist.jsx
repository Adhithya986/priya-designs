import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

import { useWishlist } from "../components/WishlistContext.jsx";
import { useCart } from "../components/CartContext.jsx";

function Wishlist() {
  const {
    wishlist,
    removeFromWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  function handleAddToCart(product) {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  }

  if (wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-empty">
          <Heart size={55} />

          <h1>Your Wishlist is Empty</h1>

          <p>
            Save your favorite bangles here and come back
            whenever you're ready.
          </p>

          <Link to="/shop" className="wishlist-shop-button">
            Explore Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">

      <section className="wishlist-header">
        <p>PRIYA DESIGNS</p>
        <h1>My Wishlist</h1>
        <span>
          Your favorite pieces, all in one place.
        </span>
      </section>

      <section className="wishlist-container">

        <div className="wishlist-count-text">
          {wishlist.length}{" "}
          {wishlist.length === 1 ? "item" : "items"} saved
        </div>

        <div className="wishlist-grid">

          {wishlist.map((product) => (
            <div className="wishlist-card" key={product.id}>

              <div className="wishlist-image">

                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                  />
                </Link>

                <button
                  className="wishlist-remove"
                  onClick={() =>
                    removeFromWishlist(product.id)
                  }
                  title="Remove from wishlist"
                >
                  <Trash2 size={18} />
                </button>

              </div>

              <div className="wishlist-info">

                <p>{product.category}</p>

                <Link to={`/product/${product.id}`}>
                  <h3>{product.name}</h3>
                </Link>

                <div className="wishlist-bottom">

                  <span>
                    ₹{product.price}
                  </span>

                  <button
                    onClick={() =>
                      handleAddToCart(product)
                    }
                  >
                    <ShoppingBag size={16} />
                    Add to Cart
                  </button>

                </div>

              </div>

            </div>
          ))}

        </div>

      </section>
    </div>
  );
}

export default Wishlist;