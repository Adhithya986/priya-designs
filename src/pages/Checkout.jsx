import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../components/CartContext.jsx";
import API_BASE_URL from "../api";

function Checkout() {
  const {
    cart,
    cartTotal,
    clearCart,
    updateItemSize,
  } = useCart();

  const navigate = useNavigate();

  const token = localStorage.getItem("priyaToken");
  const savedUser = JSON.parse(
    localStorage.getItem("priyaUser") || "null"
  );

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    bangleSize: "2.6",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      alert("Please login to proceed with checkout.");
      navigate("/login");
      return;
    }

    if (savedUser) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || savedUser.name || "",
        email: prev.email || savedUser.email || "",
        phone: prev.phone || savedUser.phone || "",
      }));
    }
  }, [token, navigate]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!token) {
      alert("Please login to place an order.");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      // Prepare order items with robust ID matching and size
      const items = cart.map((item) => ({
        productId: String(item._id || item.id),
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        size: item.size || form.bangleSize || "2.6",
        image: item.image || "",
      }));

      // Send order to backend (requires auth token)
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/orders`,
        {
          method: "POST",
          headers,
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
      message += `*Email:* ${form.email || "N/A"}%0A`;
      message += `*Address:* ${form.address}, ${form.city} - ${form.pincode}%0A`;
      message += `*Preferred Bangle Size:* ${form.bangleSize || "2.6"}%0A%0A`;

      message += `*PRODUCTS*%0A`;

      cart.forEach((item) => {
        const itemSize = item.size || form.bangleSize || "2.6";
        message += `• ${item.name} *(Size: ${itemSize})* x ${item.quantity} = ₹${
          item.price * item.quantity
        }%0A`;
      });

      message += `%0A*Total: ₹${cartTotal}*%0A`;
      message += `*Payment:* Cash on Delivery`;

      const whatsappNumber = "916305513540";

      // Clear cart reliably
      clearCart();

      alert(
        `Order placed successfully!\n\nOrder ID: ${order._id}\nTotal: ₹${cartTotal}\n\nA WhatsApp order summary will now open.`
      );

      // Open WhatsApp
      window.open(
        `https://wa.me/${whatsappNumber}?text=${message}`,
        "_blank"
      );

      navigate("/my-orders");
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

              <div className="form-group">
                <label>Bangle Size</label>

                <select
                  name="bangleSize"
                  value={form.bangleSize}
                  onChange={(e) => {
                    const newSize = e.target.value;
                    handleChange(e);
                    cart.forEach((it) => updateItemSize(it.id, newSize));
                  }}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    background: "#fff",
                    fontSize: "14px",
                    color: "#2b2020",
                    outline: "none",
                  }}
                >
                  <option value="2.2">2.2 (Small - 2.12" / 54mm)</option>
                  <option value="2.4">2.4 (Medium - 2.25" / 57mm)</option>
                  <option value="2.6">2.6 (Regular / Most Popular - 2.37" / 60mm)</option>
                  <option value="2.8">2.8 (Large - 2.50" / 64mm)</option>
                  <option value="2.10">2.10 (Extra Large - 2.62" / 67mm)</option>
                </select>
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "12px 0",
                    borderBottom: "1px solid #f0e6e4",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "6px",
                      border: "1px solid #eee",
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "14px", margin: "0 0 4px 0", color: "#2b2020" }}>
                      {item.name}
                    </h3>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "12px", color: "#666" }}>Size:</span>
                      <select
                        value={item.size || form.bangleSize || "2.6"}
                        onChange={(e) => updateItemSize(item.id, e.target.value)}
                        style={{
                          padding: "3px 8px",
                          borderRadius: "4px",
                          border: "1px solid #dfc9c4",
                          fontSize: "12px",
                          background: "#fff",
                          cursor: "pointer",
                          color: "#2b2020",
                        }}
                      >
                        <option value="2.2">2.2 (Small)</option>
                        <option value="2.4">2.4 (Medium)</option>
                        <option value="2.6">2.6 (Regular)</option>
                        <option value="2.8">2.8 (Large)</option>
                        <option value="2.10">2.10 (XL)</option>
                      </select>
                    </div>

                    <p style={{ margin: 0, fontSize: "12px", color: "#777" }}>
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                  <strong style={{ fontSize: "14px", color: "#2b2020" }}>
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