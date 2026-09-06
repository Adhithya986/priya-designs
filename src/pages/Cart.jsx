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