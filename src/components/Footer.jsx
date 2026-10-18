import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <h2>PRIYA DESIGNS</h2>

          <p>
            Elegance on Every Wrist.
          </p>

          <span>
            Beautiful bangles and accessories
            crafted for every special occasion.
          </span>
        </div>


        {/* QUICK LINKS */}
        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/home">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>


        {/* CUSTOMER */}
        <div className="footer-links">
          <h3>Customer</h3>

          <Link to="/my-orders">My Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
        </div>


        {/* CONTACT */}
        <div className="footer-contact">
          <h3>Contact Us</h3>

          <p>📞 +91 63055 13540</p>

          <p>✉️ support@priyadesigns.com</p>

          <p>
            📍 Hyderabad, Telangana, India
          </p>
        </div>

      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} Priya Designs.
          All rights reserved.
        </p>

        <p>
          Made with ❤️ for beautiful moments.
        </p>

      </div>

    </footer>
  );
}

export default Footer;