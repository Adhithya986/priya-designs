import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, X, Check, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

import API_BASE_URL from "../api";

const API_URL = `${API_BASE_URL}/api`;

const categories = [
  "Designer Bangles",
  "Bridal Bangles",
  "Stone Bangles",
  "Bangle Sets",
];

const orderStatuses = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

function AdminDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("priyaToken");

  const user = JSON.parse(
    localStorage.getItem("priyaUser") || "null"
  );

  useEffect(() => {
    if (!user || user.role !== "admin") {
      alert("Admin access required.");
      navigate("/login");
    }
  }, [navigate]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [activeSection, setActiveSection] = useState("products");

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [editingProduct, setEditingProduct] = useState(null);

  const fileInputRef = useRef(null);
  const [imageInputMode, setImageInputMode] = useState("file");
  const [imageProcessing, setImageProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [productForm, setProductForm] = useState({
    name: "",
    category: categories[0],
    price: "",
    image: "",
    badge: "",
    stock: "",
    description: "",
  });

  // =========================
  // FETCH PRODUCTS
  // =========================

  async function fetchProducts() {
    try {
      setLoadingProducts(true);

      const response = await fetch(
        `${API_URL}/products`
      );

      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Product fetch error:", error);
    } finally {
      setLoadingProducts(false);
    }
  }

  // =========================
  // FETCH ORDERS
  // =========================

  async function fetchOrders() {
    try {
      setLoadingOrders(true);

      const response = await fetch(`${API_URL}/orders`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
      const data = await response.json();

      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Order fetch error:", error);
    } finally {
      setLoadingOrders(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // =========================
  // PRODUCT FORM
  // =========================

  function handleProductChange(e) {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value,
    });
  }

  function compressAndConvertImage(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("Please upload an image file (PNG, JPG, WEBP, etc.)"));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
          const dataUrl = canvas.toDataURL(outputType, 0.85);
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error("Failed to load image."));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error("Failed to read file."));
      reader.readAsDataURL(file);
    });
  }

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageProcessing(true);
      const dataUrl = await compressAndConvertImage(file);
      setProductForm((prev) => ({
        ...prev,
        image: dataUrl,
      }));
    } catch (err) {
      alert(err.message || "Failed to process image");
    } finally {
      setImageProcessing(false);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragging(false);
  }

  async function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    try {
      setImageProcessing(true);
      const dataUrl = await compressAndConvertImage(file);
      setProductForm((prev) => ({
        ...prev,
        image: dataUrl,
      }));
    } catch (err) {
      alert(err.message || "Failed to process image");
    } finally {
      setImageProcessing(false);
    }
  }

  function handleRemoveImage() {
    setProductForm((prev) => ({
      ...prev,
      image: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function resetProductForm() {
    setProductForm({
      name: "",
      category: categories[0],
      price: "",
      image: "",
      badge: "",
      stock: "",
      description: "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setEditingProduct(null);
  }

  // =========================
  // ADD / UPDATE PRODUCT
  // =========================

  async function handleProductSubmit(e) {
    e.preventDefault();

    if (!productForm.image) {
      alert("Please upload a product image.");
      return;
    }

    try {
      const method = editingProduct ? "PUT" : "POST";

      const url = editingProduct
        ? `${API_URL}/products/${editingProduct._id}`
        : `${API_URL}/products`;

    const response = await fetch(url, {
  method,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    ...productForm,
    price: Number(productForm.price),
    stock: Number(productForm.stock),
  }),
});

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Failed to save product"
        );
        return;
      }

      alert(
        editingProduct
          ? "Product updated successfully!"
          : "Product added successfully!"
      );

      resetProductForm();
      fetchProducts();
    } catch (error) {
      console.error(error);

      alert(
        "Cannot connect to backend."
      );
    }
  }

  // =========================
  // EDIT PRODUCT
  // =========================

  function handleEditProduct(product) {
    setEditingProduct(product);

    setProductForm({
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      badge: product.badge || "",
      stock: product.stock,
      description: product.description || "",
    });

    setActiveSection("products");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================
  // DELETE PRODUCT
  // =========================

  async function handleDeleteProduct(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message || "Failed to delete product"
        );
        return;
      }

      alert("Product deleted successfully!");

      fetchProducts();
    } catch (error) {
      console.error(error);

      alert(
        "Cannot connect to backend."
      );
    }
  }

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  async function updateOrderStatus(
    orderId,
    status
  ) {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ status }),
});

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update order"
        );
        return;
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );

      alert(
        "Order status updated successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Cannot connect to backend."
      );
    }
  }

  // =========================
  // STATISTICS
  // =========================

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (total, product) =>
      total + Number(product.stock || 0),
    0
  );

  const outOfStock = products.filter(
    (product) =>
      Number(product.stock) <= 0
  ).length;

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.status === "Delivered"
  ).length;

  const totalSales = orders
    .filter(
      (order) =>
        order.status !== "Cancelled"
    )
    .reduce(
      (total, order) =>
        total + Number(order.totalAmount || 0),
      0
    );

  // =========================
  // UI
  // =========================

  return (
    <div className="admin-page">

      <div className="admin-header">

        <div>
          <p>PRIYA DESIGNS</p>

          <h1>Admin Dashboard</h1>

          <span>
            Manage products, stock and customer orders.
          </span>
        </div>

      </div>

      {/* STATISTICS */}

      <div className="admin-stats">

        <div className="admin-stat-card">
          <span>Total Products</span>
          <strong>{totalProducts}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Stock</span>
          <strong>{totalStock}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Out of Stock</span>
          <strong>{outOfStock}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Orders</span>
          <strong>{totalOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Pending Orders</span>
          <strong>{pendingOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Delivered</span>
          <strong>{deliveredOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Sales</span>
          <strong>
            ₹{totalSales.toLocaleString("en-IN")}
          </strong>
        </div>

      </div>

      {/* NAVIGATION */}

      <div className="admin-tabs">

        <button
          className={
            activeSection === "products"
              ? "admin-tab active"
              : "admin-tab"
          }
          onClick={() =>
            setActiveSection("products")
          }
        >
          Products
        </button>

        <button
          className={
            activeSection === "orders"
              ? "admin-tab active"
              : "admin-tab"
          }
          onClick={() =>
            setActiveSection("orders")
          }
        >
          Orders
          {pendingOrders > 0 && (
            <span className="admin-order-badge">
              {pendingOrders}
            </span>
          )}
        </button>

      </div>

      {/* =========================
          PRODUCTS SECTION
      ========================= */}

      {activeSection === "products" && (
        <section className="admin-section">

          <div className="admin-section-header">

            <div>
              <h2>
                {editingProduct
                  ? "Edit Product"
                  : "Add New Product"}
              </h2>

              <p>
                Add and manage your bangle collection.
              </p>
            </div>

            {editingProduct && (
              <button
                className="admin-cancel-button"
                onClick={resetProductForm}
              >
                Cancel Edit
              </button>
            )}

          </div>

          <form
            className="admin-product-form"
            onSubmit={handleProductSubmit}
          >

            <div className="form-group">
              <label>Product Name</label>

              <input
                type="text"
                name="name"
                value={productForm.name}
                onChange={handleProductChange}
                placeholder="Royal Gold Bangles"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>

              <select
                name="category"
                value={productForm.category}
                onChange={handleProductChange}
              >
                {categories.map(
                  (category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-group">
              <label>Price</label>

              <input
                type="number"
                name="price"
                value={productForm.price}
                onChange={handleProductChange}
                placeholder="1499"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Stock</label>

              <input
                type="number"
                name="stock"
                value={productForm.stock}
                onChange={handleProductChange}
                placeholder="10"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Badge</label>

              <input
                type="text"
                name="badge"
                value={productForm.badge}
                onChange={handleProductChange}
                placeholder="BESTSELLER"
              />
            </div>

            <div className="form-group admin-full-width">
              <div className="admin-image-header">
                <label>Product Image</label>
                <div className="admin-image-mode-toggle">
                  <button
                    type="button"
                    className={`image-mode-btn ${imageInputMode === "file" ? "active" : ""}`}
                    onClick={() => setImageInputMode("file")}
                  >
                    <Upload size={13} /> Upload Image
                  </button>
                  <button
                    type="button"
                    className={`image-mode-btn ${imageInputMode === "url" ? "active" : ""}`}
                    onClick={() => setImageInputMode("url")}
                  >
                    <LinkIcon size={13} /> Image URL
                  </button>
                </div>
              </div>

              {imageInputMode === "file" ? (
                <div className="admin-file-upload-section">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileSelect}
                  />

                  {productForm.image ? (
                    <div className="admin-image-preview-card">
                      <div className="preview-image-container">
                        <img
                          src={productForm.image}
                          alt="Preview"
                          className="preview-img"
                        />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={handleRemoveImage}
                          title="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="preview-info">
                        <span className="preview-success">
                          <Check size={14} /> Image ready
                        </span>
                        <button
                          type="button"
                          className="change-image-btn"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Change Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`admin-upload-dropzone ${isDragging ? "dragging" : ""}`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="upload-icon-circle">
                        <Upload size={22} />
                      </div>
                      <div className="upload-text">
                        <strong>Click to upload image</strong> or drag and drop
                      </div>
                      <span className="upload-hint">
                        PNG, JPG, WEBP, GIF (Auto-compressed)
                      </span>
                      {imageProcessing && (
                        <div className="upload-processing">
                          Optimizing image...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="admin-url-input-container">
                  <input
                    type="url"
                    name="image"
                    value={productForm.image}
                    onChange={handleProductChange}
                    placeholder="https://images.unsplash.com/..."
                  />
                  {productForm.image && (
                    <div className="url-preview-thumb">
                      <img
                        src={productForm.image}
                        alt="URL Preview"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="form-group admin-full-width">
              <label>Description</label>

              <textarea
                name="description"
                value={productForm.description}
                onChange={handleProductChange}
                placeholder="Describe the product..."
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="admin-submit-button"
            >
              {editingProduct
                ? "Update Product"
                : "Add Product"}
            </button>

          </form>

          {/* PRODUCT TABLE */}

          <div className="admin-list-header">
            <h2>Product Inventory</h2>

            <button
              onClick={fetchProducts}
              className="admin-refresh-button"
            >
              Refresh
            </button>
          </div>

          {loadingProducts ? (
            <div className="admin-message">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="admin-message">
              No products found.
            </div>
          ) : (
            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {products.map(
                    (product) => (
                      <tr key={product._id}>

                        <td>
                          <div className="admin-product-cell">

                            <img
                              src={product.image}
                              alt={product.name}
                            />

                            <span>
                              {product.name}
                            </span>

                          </div>
                        </td>

                        <td>
                          {product.category}
                        </td>

                        <td>
                          ₹{product.price}
                        </td>

                        <td>
                          {product.stock}
                        </td>

                        <td>

                          <span
                            className={
                              Number(
                                product.stock
                              ) > 0
                                ? "stock-status in-stock"
                                : "stock-status out-stock"
                            }
                          >
                            {Number(
                              product.stock
                            ) > 0
                              ? "In Stock"
                              : "Out of Stock"}
                          </span>

                        </td>

                        <td>

                          <div className="admin-actions">

                            <button
                              onClick={() =>
                                handleEditProduct(
                                  product
                                )
                              }
                              className="edit-button"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteProduct(
                                  product._id
                                )
                              }
                              className="delete-button"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>
      )}

      {/* =========================
          ORDERS SECTION
      ========================= */}

      {activeSection === "orders" && (
        <section className="admin-section">

          <div className="admin-section-header">

            <div>
              <h2>Customer Orders</h2>

              <p>
                Manage and track all customer orders.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="admin-refresh-button"
            >
              Refresh Orders
            </button>

          </div>

          {loadingOrders ? (
            <div className="admin-message">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="admin-message">
              <h3>No Orders Yet</h3>

              <p>
                Customer orders will appear here.
              </p>
            </div>
          ) : (
            <div className="admin-orders">

              {orders.map((order) => (

                <div
                  className="admin-order-card"
                  key={order._id}
                >

                  <div className="admin-order-header">

                    <div>

                      <span>
                        Order ID
                      </span>

                      <strong>
                        {order._id}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Date
                      </span>

                      <strong>
                        {new Date(
                          order.createdAt
                        ).toLocaleString("en-IN")}
                      </strong>

                    </div>

                    <div>

                      <span>
                        Status
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(
                            order._id,
                            e.target.value
                          )
                        }
                        className={`order-status-select status-${order.status.toLowerCase()}`}
                      >
                        {orderStatuses.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}
                      </select>

                    </div>

                  </div>

                  <div className="admin-order-body">

                    {/* CUSTOMER */}

                    <div className="admin-order-customer">

                      <h3>
                        Customer
                      </h3>

                      <p>
                        <strong>Name:</strong>{" "}
                        {order.customer.name}
                      </p>

                      <p>
                        <strong>Phone:</strong>{" "}
                        {order.customer.phone}
                      </p>

                      <p>
                        <strong>Email:</strong>{" "}
                        {order.customer.email ||
                          "Not provided"}
                      </p>

                      <p>
                        <strong>Address:</strong>{" "}
                        {order.customer.address}
                      </p>

                      <p>
                        <strong>City:</strong>{" "}
                        {order.customer.city}
                      </p>

                      <p>
                        <strong>Pincode:</strong>{" "}
                        {order.customer.pincode}
                      </p>

                    </div>

                    {/* PRODUCTS */}

                    <div className="admin-order-products">

                      <h3>
                        Products
                      </h3>

                      {order.items.map(
                        (item, index) => (
                          <div
                            className="admin-order-item"
                            key={`${order._id}-${index}`}
                          >

                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                              />
                            )}

                            <div>

                              <strong>
                                {item.name}
                              </strong>

                              {item.size && (
                                <p style={{ margin: "2px 0", fontSize: "12px", color: "#a66a73", fontWeight: "600" }}>
                                  Size: {item.size}
                                </p>
                              )}

                              <p>
                                ₹{item.price} ×{" "}
                                {item.quantity}
                              </p>

                            </div>

                            <span>
                              ₹
                              {(
                                item.price *
                                item.quantity
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </span>

                          </div>
                        )
                      )}

                    </div>

                  </div>

                  {/* TOTAL */}

                  <div className="admin-order-footer">

                    <span>
                      Payment:{" "}
                      <strong>
                        {order.paymentMethod}
                      </strong>
                    </span>

                    <strong className="admin-order-total">
                      Total: ₹
                      {Number(
                        order.totalAmount
                      ).toLocaleString("en-IN")}
                    </strong>

                  </div>

                </div>

              ))}

            </div>
          )}

        </section>
      )}

    </div>
  );
}

export default AdminDashboard;