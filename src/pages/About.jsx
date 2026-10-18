import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function About() {
  return (
    <div className="page" style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px" }}>
      <p style={{ letterSpacing: "2px", color: "#a66a73", fontSize: "13px", fontWeight: "600", marginBottom: "8px" }}>
        OUR STORY
      </p>
      <h1 style={{ fontSize: "34px", marginBottom: "20px", color: "#2b2020" }}>About Priya Designs</h1>

      <p style={{ fontSize: "17px", color: "#555", lineHeight: "1.8", marginBottom: "25px" }}>
        Welcome to <strong>Priya Designs</strong>, where traditional craftsmanship meets contemporary beauty. We believe that a bangle is more than just jewelry — it is an expression of grace, celebration, and individuality.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          margin: "35px 0",
        }}
      >
        <div style={{ background: "#fffaf7", border: "1px solid #ebd9d4", padding: "20px", borderRadius: "10px" }}>
          <h3 style={{ color: "#a66a73", marginBottom: "10px", fontSize: "18px" }}>✨ Premium Quality</h3>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
            Every piece is curated with high-grade materials, sparkling stones, and long-lasting finishes.
          </p>
        </div>

        <div style={{ background: "#fffaf7", border: "1px solid #ebd9d4", padding: "20px", borderRadius: "10px" }}>
          <h3 style={{ color: "#a66a73", marginBottom: "10px", fontSize: "18px" }}>👑 Festive & Bridal</h3>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
            From majestic wedding sets to subtle daily elegance, our designs fit every mood and moment.
          </p>
        </div>

        <div style={{ background: "#fffaf7", border: "1px solid #ebd9d4", padding: "20px", borderRadius: "10px" }}>
          <h3 style={{ color: "#a66a73", marginBottom: "10px", fontSize: "18px" }}>📦 Delivered With Care</h3>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
            Secure packaging and swift customer support ensure your unboxing experience is memorable.
          </p>
        </div>
      </div>

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <Link to="/shop" className="shop-button">
          EXPLORE OUR COLLECTION
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export default About;