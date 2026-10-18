import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { CartProvider } from "./components/CartContext";
import { WishlistProvider } from "./components/WishlistContext";


/* =========================================================
   AUTH GUARDS
========================================================= */

// Protect routes that require login
function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("priyaToken");

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

// Protect admin dashboard (requires login + admin role)
function AdminRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("priyaToken");
  const user = JSON.parse(localStorage.getItem("priyaUser") || "null");

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
}

// Routes only accessible when NOT logged in (Login & Register)
function PublicRoute({ children }) {
  const token = localStorage.getItem("priyaToken");
  const user = JSON.parse(localStorage.getItem("priyaUser") || "null");

  if (token) {
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return children;
}

/* =========================================================
   START PAGE
========================================================= */

function StartPage() {
  const token = localStorage.getItem("priyaToken");
  const user = JSON.parse(localStorage.getItem("priyaUser") || "null");

  if (token) {
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/home" replace />;
  }

  return <Navigate to="/login" replace />;
}


/* =========================================================
   LAYOUT
========================================================= */

function Layout() {
  const location = useLocation();
  const token = localStorage.getItem("priyaToken");

  /*
    Login, Register, and Admin pages have their own layouts,
    or user is not logged in, so Navbar/Footer are hidden.
  */
  const hideNavbar =
    !token ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/admin";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>

        {/* START */}
        <Route
          path="/"
          element={<StartPage />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* HOME */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* SHOP */}
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          }
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          }
        />

        {/* CONTACT */}
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* WISHLIST */}
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        {/* PRODUCT DETAILS */}
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        {/* MY ORDERS */}
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* UNKNOWN PAGE */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

      {!hideNavbar && <Footer />}
    </>
  );
}


/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Layout />
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;