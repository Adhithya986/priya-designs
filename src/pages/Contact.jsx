function Contact() {
  const whatsappNumber = "916305513540";

  return (
    <div className="page" style={{ maxWidth: "700px", margin: "40px auto", padding: "0 20px" }}>
      <p style={{ letterSpacing: "2px", color: "#a66a73", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
        PRIYA DESIGNS
      </p>
      <h1 style={{ fontSize: "32px", marginBottom: "15px", color: "#2b2020" }}>Contact Us</h1>

      <p style={{ fontSize: "16px", color: "#666", lineHeight: "1.6" }}>
        Have a question about our bangle collections, custom sizing, or your order? We would love to assist you!
      </p>

      <div
        style={{
          marginTop: "30px",
          background: "#fffaf7",
          border: "1px solid #ebd9d4",
          borderRadius: "12px",
          padding: "30px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <strong style={{ display: "block", color: "#2b2020", marginBottom: "5px" }}>📞 Phone & WhatsApp</strong>
          <p style={{ margin: 0, color: "#555" }}>+91 63055 13540</p>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <strong style={{ display: "block", color: "#2b2020", marginBottom: "5px" }}>📧 Email</strong>
          <p style={{ margin: 0, color: "#555" }}>support@priyadesigns.com</p>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <strong style={{ display: "block", color: "#2b2020", marginBottom: "5px" }}>📍 Studio Location</strong>
          <p style={{ margin: 0, color: "#555" }}>Hyderabad, Telangana, India</p>
        </div>

        <a
          href={`https://wa.me/${whatsappNumber}?text=Hi%20Priya%20Designs,%20I%20have%20an%20inquiry%20regarding%20your%20products.`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "#25D366",
            color: "#ffffff",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
            fontSize: "15px",
          }}
        >
          💬 Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}

export default Contact;