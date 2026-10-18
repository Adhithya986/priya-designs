import { ShoppingBag, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "./WishlistContext.jsx";

function ProductCard({ product, onAddToCart }) {
  const { toggleWishlist, isInWishlist } = useWishlist();

  const productId = String(product._id || product.id);
  const liked = isInWishlist(productId);
  const outOfStock = Number(product.stock) <= 0;

  const normalizedProduct = {
    ...product,
    id: productId,
    _id: productId,
  };

  return (
    <div className="product-card">

      <div className="product-image">

        <Link to={`/product/${productId}`}>
          <img src={product.image} alt={product.name} />
        </Link>

        <button
          className={
            liked
              ? "wishlist-button active"
              : "wishlist-button"
          }
          onClick={() => toggleWishlist(normalizedProduct)}
        >
          <Heart
            size={19}
            fill={liked ? "currentColor" : "none"}
          />
        </button>

        {product.badge && (
          <span className="product-badge">
            {product.badge}
          </span>
        )}

      </div>

      <div className="product-info">

        <p className="product-category">
          {product.category}
        </p>

        <Link
          to={`/product/${productId}`}
          className="product-name-link"
        >
          <h3>{product.name}</h3>
        </Link>

        <div className="product-bottom">

          <div>
            <span className="product-price">
              ₹{product.price}
            </span>

            <small className="product-stock">
              {outOfStock
                ? "Out of Stock"
                : `${product.stock} available`}
            </small>
          </div>

          <button
            className={
              outOfStock
                ? "add-cart-button disabled"
                : "add-cart-button"
            }
            disabled={outOfStock}
            onClick={() => onAddToCart(normalizedProduct)}
          >
            <ShoppingBag size={17} />

            {outOfStock ? "Sold Out" : "Add"}
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProductCard;