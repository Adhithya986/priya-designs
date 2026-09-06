import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  async function fetchMyOrders() {
    try {
      const token = localStorage.getItem("priyaToken");

      if (!token) {
        alert("Please login to view your orders.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to load orders.");
        return;
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("My orders error:", error);

      alert(
        "Cannot connect to server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusClass(status) {
    switch (status) {
      case "Delivered":
        return "status-delivered";

      case "Cancelled":
        return "status-cancelled";

      case "Shipped":
        return "status-shipped";

      case "Packed":
        return "status-packed";

      case "Confirmed":
        return "status-confirmed";

      default:
        return "status-pending";
    }
  }

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="orders-loading">
          <h2>Loading your orders...</h2>
          <p>Please wait.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">

      {/* HEADER */}
      <div className="orders-header">
        <div>
          <p className="orders-kicker">
            PRIYA DESIGNS
          </p>

          <h1>My Orders</h1>

          <p>
            Track and manage your Priya Designs orders.
          </p>
        </div>
      </div>


      {/* NO ORDERS */}
      {orders.length === 0 ? (
        <div className="no-orders">

          <div className="no-orders-icon">
            📦
          </div>

          <h2>No orders yet</h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <Link
            to="/shop"
            className="shop-now-button"
          >
            Start Shopping
          </Link>

        </div>
      ) : (

        /* ORDERS */
        <div className="orders-list">

          {orders.map((order) => (

            <div
              className="order-card"
              key={order._id}
            >

              {/* ORDER HEADER */}
              <div className="order-card-header">

                <div>
                  <span className="order-label">
                    Order ID
                  </span>

                  <strong>
                    #{order._id.slice(-8).toUpperCase()}
                  </strong>
                </div>

                <div className="order-date">
                  <span className="order-label">
                    Ordered On
                  </span>

                  <strong>
                    {formatDate(order.createdAt)}
                  </strong>
                </div>

                <span
                  className={`order-status ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>

              </div>


              {/* PRODUCTS */}
              <div className="order-products">

                {order.items.map((item, index) => (

                  <div
                    className="order-product"
                    key={`${order._id}-${index}`}
                  >

                    <div className="order-product-image">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                        />
                      ) : (
                        <span>💍</span>
                      )}

                    </div>

                    <div className="order-product-info">

                      <h3>
                        {item.name}
                      </h3>

                      <p>
                        Quantity: {item.quantity}
                      </p>

                      <p>
                        ₹{item.price.toLocaleString("en-IN")} each
                      </p>

                    </div>

                    <div className="order-product-total">
                      ₹
                      {(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </div>

                  </div>

                ))}

              </div>


              {/* ORDER FOOTER */}
              <div className="order-card-footer">

                <div className="delivery-info">

                  <strong>
                    Delivery Address
                  </strong>

                  <p>
                    {order.customer.name}
                    <br />

                    {order.customer.address},{" "}
                    {order.customer.city}
                    <br />

                    PIN: {order.customer.pincode}
                    <br />

                    Phone: {order.customer.phone}
                  </p>

                </div>


                <div className="payment-info">

                  <strong>
                    Payment
                  </strong>

                  <p>
                    {order.paymentMethod ||
                      "Cash on Delivery"}
                  </p>

                </div>


                <div className="order-total">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹
                    {order.totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyOrders;