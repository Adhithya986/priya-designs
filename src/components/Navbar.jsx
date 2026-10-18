import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Menu,
  Heart,
  X,
  User,
  Package,
  LogOut,
} from "lucide-react";

import { useCart } from "./CartContext.jsx";
import { useWishlist } from "./WishlistContext.jsx";

function Navbar() {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("priyaToken");

  const user = JSON.parse(
    localStorage.getItem("priyaUser") || "null"
  );

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    localStorage.removeItem("priyaToken");
    localStorage.removeItem("priyaUser");
    localStorage.removeItem("priyaLoggedIn");

    setMenuOpen(false);

    alert("You have been logged out.");

    navigate("/login");
  }

  return (
    <>
      <nav className="navbar">

        {/* LOGO */}
        <div className="logo">
          <Link to="/home" onClick={closeMenu}>
            PRIYA <span>DESIGNS</span>
          </Link>
        </div>


        {/* DESKTOP NAVIGATION */}
        <div className="nav-links">

          <Link to="/home">Home</Link>

          <Link to="/shop">Shop</Link>

          <Link to="/about">About</Link>

          <Link to="/contact">Contact</Link>

          {token && user?.role === "customer" && (
            <Link to="/my-orders">
              My Orders
            </Link>
          )}

          {token && user?.role === "admin" && (
            <Link to="/admin">
              Admin
            </Link>
          )}

        </div>


        {/* RIGHT SIDE ICONS */}
        <div className="nav-icons">

          {/* SEARCH */}
          <button
            className="nav-icon-button"
            onClick={() => navigate("/shop")}
            aria-label="Search products"
          >
            <Search size={20} />
          </button>


          {/* WISHLIST */}
          <Link
            to="/wishlist"
            className="wishlist-icon"
            aria-label="Wishlist"
          >
            <Heart
              size={21}
              fill={
                wishlistCount > 0
                  ? "currentColor"
                  : "none"
              }
            />

            {wishlistCount > 0 && (
              <span className="wishlist-count">
                {wishlistCount}
              </span>
            )}
          </Link>


          {/* CART */}
          <Link
            to="/cart"
            className="cart-icon"
            aria-label="Shopping cart"
          >
            <ShoppingBag size={21} />

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </Link>


          {/* USER */}
          {token && (
            <button
              className="nav-user-button"
              onClick={() => {
                if (user?.role === "admin") {
                  navigate("/admin");
                } else {
                  navigate("/my-orders");
                }
              }}
              aria-label="Account"
              title={user?.name ? `${user.name} (${user.role})` : "Account"}
            >
              <User size={20} />
            </button>
          )}


          {/* LOGOUT */}
          {token && (
            <button
              className="nav-icon-button"
              onClick={handleLogout}
              aria-label="Logout"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          )}


          {/* LOGIN */}
          {!token && (
            <Link
              to="/login"
              className="nav-login-button"
            >
              Login
            </Link>
          )}


          {/* MOBILE MENU BUTTON */}
          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>

        </div>

      </nav>


      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-nav">

          <Link
            to="/home"
            onClick={closeMenu}
          >
            Home
          </Link>

          <Link
            to="/shop"
            onClick={closeMenu}
          >
            Shop
          </Link>

          <Link
            to="/about"
            onClick={closeMenu}
          >
            About
          </Link>

          <Link
            to="/contact"
            onClick={closeMenu}
          >
            Contact
          </Link>


          {token && user?.role === "customer" && (
            <Link
              to="/my-orders"
              onClick={closeMenu}
            >
              <Package size={18} />
              My Orders
            </Link>
          )}


          <Link
            to="/wishlist"
            onClick={closeMenu}
          >
            <Heart size={18} />
            Wishlist
            {wishlistCount > 0 && (
              <span className="mobile-count">
                {wishlistCount}
              </span>
            )}
          </Link>


          <Link
            to="/cart"
            onClick={closeMenu}
          >
            <ShoppingBag size={18} />
            Cart
            {cartCount > 0 && (
              <span className="mobile-count">
                {cartCount}
              </span>
            )}
          </Link>


          {token && user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={closeMenu}
            >
              <User size={18} />
              Admin Dashboard
            </Link>
          )}


          {!token ? (
            <Link
              to="/login"
              onClick={closeMenu}
              className="mobile-login"
            >
              <User size={18} />
              Login
            </Link>
          ) : (
            <button
              className="mobile-logout"
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          )}

        </div>
      )}
    </>
  );
}

export default Navbar;