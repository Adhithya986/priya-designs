import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useCart } from "../components/CartContext.jsx";

function Cart() {
  const {
    cart,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    updateItemSize,
  } = useCart();

  if (cart.length === 0) {
    return (
      <div className="empty-cart">

        <div className="empty-cart-icon">
          🛍️
        </div>

        <h1>Your Cart is Empty</h1>

        <p>
          Looks like you haven't added anything to your cart yet.
        </p>

        <Link to="/shop" className="shop-button">
          <ArrowLeft size={18} />
          CONTINUE SHOPPING
        </Link>

      </div>
    );
  }

  return (
    <div className="cart-page">

      <div className="cart-header">
        <p>PRIYA DESIGNS</p>
        <h1>Your Shopping Cart</h1>
      </div>

      <div className="cart-container">

        {/* CART ITEMS */}

        <div className="cart-items">

          {cart.map((item) => (
            <div className="cart-item" key={item.id}>

              <img
                src={item.image}
                alt={item.name}
              />

              <div className="cart-item-details">

                <p>{item.category}</p>

                <h3>{item.name}</h3>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "6px 0 10px" }}>
                  <span style={{ fontSize: "13px", color: "#666" }}>Size:</span>
                  <select
                    value={item.size || "2.6"}
                    onChange={(e) => updateItemSize(item.id, e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid #dfc9c4",
                      fontSize: "13px",
                      background: "#fff",
                      cursor: "pointer",
                      color: "#2b2020",
                    }}
                  >
                    <option value="2.2">2.2 (Small)</option>
                    <option value="2.4">2.4 (Medium)</option>
                    <option value="2.6">2.6 (Regular)</option>
                    <option value="2.8">2.8 (Large)</option>
                    <option value="2.10">2.10 (Extra Large)</option>
                  </select>
                </div>

                <strong>
                  ₹{item.price}
                </strong>

                <div className="quantity-controls">

                  <button
                    onClick={() =>
                      decreaseQuantity(item.id)
                    }
                  >
                    <Minus size={16} />
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      increaseQuantity(item.id)
                    }
                  >
                    <Plus size={16} />
                  </button>

                </div>

              </div>

              <div className="cart-item-right">

                <strong>
                  ₹{item.price * item.quantity}
                </strong>

                <button
                  className="remove-button"
                  onClick={() =>
                    removeFromCart(item.id)
                  }
                >
                  <Trash2 size={18} />
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* ORDER SUMMARY */}

        <div className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{cartTotal}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>FREE</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <strong>₹{cartTotal}</strong>
          </div>

          <Link to="/checkout" className="checkout-button">
  Proceed to Checkout
</Link>

          <Link
            to="/shop"
            className="continue-shopping"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>

        </div>

      </div>
    </div>
  );
}

export default Cart;