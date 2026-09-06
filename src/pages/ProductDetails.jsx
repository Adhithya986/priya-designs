import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, Heart, ArrowLeft, Plus, Minus } from "lucide-react";
import { useCart } from "../components/CartContext.jsx";
import { useWishlist } from "../components/WishlistContext.jsx";
const products = [
  {
    id: 1,
    name: "Royal Gold Bangles",
    category: "Designer Bangles",
    price: 1499,
    badge: "BESTSELLER",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80",
    description:
      "A beautiful golden bangle design created for elegant everyday wear and special occasions.",
  },
  {
    id: 2,
    name: "Bridal Stone Bangles",
    category: "Bridal Bangles",
    price: 1899,
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=80",
    description:
      "Elegant stone-studded bangles designed to complement your bridal and festive look.",
  },
  {
    id: 3,
    name: "Classic Pearl Bangles",
    category: "Stone Bangles",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    description:
      "A graceful pearl-inspired design that adds a sophisticated touch to any outfit.",
  },
  {
    id: 4,
    name: "Traditional Red Set",
    category: "Bangle Sets",
    price: 999,
    badge: "POPULAR",
    image:
      "https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=80",
    description:
      "A vibrant traditional bangle set perfect for festive celebrations and family occasions.",
  },
  {
    id: 5,
    name: "Elegant Golden Set",
    category: "Designer Bangles",
    price: 2199,
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=80",
    description:
      "A premium golden set combining traditional charm with a modern elegant finish.",
  },
  {
    id: 6,
    name: "Rose Gold Bangles",
    category: "Designer Bangles",
    price: 1599,
    badge: "NEW",
    image:
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800&q=80",
    description:
      "Stylish rose-gold bangles designed for a modern and elegant appearance.",
  },
  {
    id: 7,
    name: "Bridal Kundan Set",
    category: "Bridal Bangles",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1588444650733-dac45c43f7a5?auto=format&fit=crop&w=800&q=80",
    description:
      "A luxurious kundan-inspired set made for bridal celebrations and grand occasions.",
  },
  {
    id: 8,
    name: "Floral Stone Bangles",
    category: "Stone Bangles",
    price: 1199,
    image:
      "https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?auto=format&fit=crop&w=800&q=80",
    description:
      "A delicate floral design with sparkling stone details for an elegant finish.",
  },
];

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find(
    (item) => item.id === Number(id)
  );
  const {
  toggleWishlist,
  isInWishlist
} = useWishlist();

const liked = isInWishlist(product.id);

  if (!product) {
    return (
      <div className="page">
        <h1>Product Not Found</h1>

        <Link to="/shop" className="shop-button">
          <ArrowLeft size={18} />
          BACK TO SHOP
        </Link>
      </div>
    );
  }

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  return (
    <div className="product-details-page">

      <Link to="/shop" className="back-to-shop">
        <ArrowLeft size={17} />
        Back to Collection
      </Link>

      <div className="product-details-container">

        {/* IMAGE */}

        <div className="product-details-image">

          <img
            src={product.image}
            alt={product.name}
          />

          {product.badge && (
            <span className="details-badge">
              {product.badge}
            </span>
          )}

        </div>

        {/* DETAILS */}

        <div className="product-details-content">

          <p className="details-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <div className="details-rating">
            ⭐⭐⭐⭐⭐
            <span> 4.9 (24 reviews)</span>
          </div>

          <div className="details-price">
            ₹{product.price}
          </div>

          <p className="details-description">
            {product.description}
          </p>

          <div className="details-divider" />

          {/* QUANTITY */}

          <div className="quantity-section">

            <span>Quantity</span>

            <div className="details-quantity">

              <button
                onClick={() =>
                  setQuantity(Math.max(1, quantity - 1))
                }
              >
                <Minus size={17} />
              </button>

              <span>{quantity}</span>

              <button
                onClick={() =>
                  setQuantity(quantity + 1)
                }
              >
                <Plus size={17} />
              </button>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="details-actions">

            <button
              className="details-add-cart"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={19} />

              {added
                ? "ADDED TO CART ✓"
                : "ADD TO CART"}
            </button>

           <button
  className={
    liked
      ? "product-details-wishlist active"
      : "product-details-wishlist"
  }
  onClick={() => toggleWishlist(product)}
>
  <Heart
    size={20}
    fill={liked ? "currentColor" : "none"}
  />

  {liked ? "Remove from Wishlist" : "Add to Wishlist"}
</button>

          </div>

          <div className="product-info-box">

            <p>✓ Premium quality design</p>
            <p>✓ Carefully packed for delivery</p>
            <p>✓ Perfect for gifting</p>
            <p>✓ Easy returns available</p>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ProductDetails;