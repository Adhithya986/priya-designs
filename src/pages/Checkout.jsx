import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../components/CartContext.jsx";

function Checkout() {
  const {
    cart,
    cartTotal,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      // Prepare order items
      const items = cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || "",
      }));

      // Send order to backend
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",
          headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("priyaToken")}`,
},
          body: JSON.stringify({
            customer: form,
            items,
            totalAmount: cartTotal,
            paymentMethod: "Cash on Delivery",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to place order.");
        return;
      }

      const order = data.order;

      // Create WhatsApp message
      let message = `*PRIYA DESIGNS - NEW ORDER*%0A%0A`;

      message += `*Order ID:* ${order._id}%0A`;
      message += `*Customer:* ${form.name}%0A`;
      message += `*Phone:* ${form.phone}%0A`;
      message += `*Email:* ${form.email}%0A`;
      message += `*Address:* ${form.address}, ${form.city} - ${form.pincode}%0A%0A`;

      message += `*PRODUCTS*%0A`;

      cart.forEach((item) => {
        message += `${item.name} x ${item.quantity} = ₹${
          item.price * item.quantity
        }%0A`;
      });

      message += `%0A*Total: ₹${cartTotal}*%0A`;
      message += `*Payment:* Cash on Delivery`;

      // Replace this with your actual WhatsApp number
      const whatsappNumber = "916305513540";

      // Clear cart
      cart.forEach((item) => {
        removeFromCart(item.id);
      });

      alert(
        `Order placed successfully!%0AOrder ID: ${order._id}`
      );

      // Open WhatsApp
      window.open(
        `https://wa.me/${whatsappNumber}?text=${message}`,
        "_blank"
      );

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(
        "Cannot connect to server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h1>Your Cart is Empty</h1>
          <p>Add some beautiful bangles before checking out.</p>

          <button
            onClick={() => navigate("/shop")}
            className="checkout-button"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        <div className="checkout-header">
          <p>PRIYA DESIGNS</p>
          <h1>Checkout</h1>
          <span>Complete your order details.</span>
        </div>

        <div className="checkout-layout">

          {/* Customer Details */}
          <div className="checkout-form-card">

            <h2>Customer Details</h2>

            <form onSubmit={handleSubmit}>

              <div className="checkout-form-grid">

                <div className="form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter 10-digit phone number"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>

              </div>

              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label>Address</label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                  rows="4"
                  required
                />
              </div>

              <div className="checkout-form-grid">

                <div className="form-group">
                  <label>City</label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Pincode</label>

                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    pattern="[0-9]{6}"
                    required
                  />
                </div>

              </div>

              <div className="payment-box">

                <h3>Payment Method</h3>

                <label>
                  <input
                    type="radio"
                    checked
                    readOnly
                  />

                  Cash on Delivery
                </label>

              </div>

              <button
                type="submit"
                className="checkout-button"
                disabled={loading}
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">

            <h2>Order Summary</h2>

            <div className="checkout-items">

              {cart.map((item) => (
                <div
                  className="checkout-item"
                  key={item.id}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>
                    <h3>{item.name}</h3>

                    <p>
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>
                </div>
              ))}

            </div>

            <div className="checkout-total">

              <span>Total</span>

              <strong>
                ₹{cartTotal}
              </strong>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Checkout;