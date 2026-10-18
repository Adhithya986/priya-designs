import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, Heart, ArrowLeft, Plus, Minus } from "lucide-react";
import { useCart } from "../components/CartContext.jsx";
import { useWishlist } from "../components/WishlistContext.jsx";
import API_BASE_URL from "../api";

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
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("2.6");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
        const data = await response.json();

        if (response.ok && data.success && data.product) {
          const pid = String(data.product._id || data.product.id);
          setProduct({
            ...data.product,
            id: pid,
            _id: pid,
          });
          return;
        }

        // Check fallback products
        const fallback = products.find((p) => String(p.id) === String(id));
        if (fallback) {
          setProduct({
            ...fallback,
            id: String(fallback.id),
            _id: String(fallback.id),
          });
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Failed to fetch product from API", err);
        const fallback = products.find((p) => String(p.id) === String(id));
        if (fallback) {
          setProduct({
            ...fallback,
            id: String(fallback.id),
            _id: String(fallback.id),
          });
        } else {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  const liked = product ? isInWishlist(product.id || product._id) : false;
  const outOfStock = product && Number(product.stock) <= 0;

  if (loading) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Loading Product Details...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h1>Product Not Found</h1>
        <p style={{ margin: "20px 0" }}>
          The product you are looking for does not exist or has been removed.
        </p>
        <Link to="/shop" className="shop-button">
          <ArrowLeft size={18} />
          BACK TO SHOP
        </Link>
      </div>
    );
  }

  function handleAddToCart() {
    if (outOfStock) {
      alert("This product is currently out of stock.");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize);
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

          {/* BANGLE SIZE */}
          <div className="bangle-size-section" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#2b2020" }}>
                Select Bangle Size: <strong style={{ color: "#a66a73" }}>{selectedSize}</strong>
              </span>
              <span style={{ fontSize: "12px", color: "#888" }}>Indian Size</span>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["2.2", "2.4", "2.6", "2.8", "2.10"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "6px",
                    border: selectedSize === s ? "2px solid #a66a73" : "1px solid #dfc9c4",
                    background: selectedSize === s ? "#fff3f2" : "#ffffff",
                    color: selectedSize === s ? "#a66a73" : "#2b2020",
                    fontWeight: selectedSize === s ? "700" : "500",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

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