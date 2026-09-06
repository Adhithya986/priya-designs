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
   START PAGE
========================================================= */

function StartPage() {
  const token = localStorage.getItem("priyaToken");

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return <Navigate to="/login" replace />;
}


/* =========================================================
   LAYOUT
========================================================= */

function Layout() {
  const location = useLocation();

  /*
    Login, Register and Admin pages have their own layouts,
    so Navbar/Footer are hidden there.
  */
  const hideNavbar =
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

        {/* HOME */}
        <Route
          path="/home"
          element={<Home />}
        />

        {/* SHOP */}
        <Route
          path="/shop"
          element={<Shop />}
        />

        {/* ABOUT */}
        <Route
          path="/about"
          element={<About />}
        />

        {/* CONTACT */}
        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* CART */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* WISHLIST */}
        <Route
          path="/wishlist"
          element={<Wishlist />}
        />

        {/* PRODUCT DETAILS */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* MY ORDERS */}
        <Route
          path="/my-orders"
          element={<MyOrders />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
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