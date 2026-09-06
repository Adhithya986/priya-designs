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

          <a href="/home">Home</a>
          <a href="/shop">Shop</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>


        {/* CUSTOMER */}
        <div className="footer-links">
          <h3>Customer</h3>

          <a href="/my-orders">My Orders</a>
          <a href="/wishlist">Wishlist</a>
          <a href="/cart">Cart</a>
          <a href="/login">Login</a>
        </div>


        {/* CONTACT */}
        <div className="footer-contact">
          <h3>Contact Us</h3>

          <p>📞 +91 99999 99999</p>

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