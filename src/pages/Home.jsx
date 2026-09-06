import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Home() {
  return (
    <div>

      {/* HERO SECTION */}
      <section className="hero">

        <div className="hero-content">

          <p className="hero-small">
            PRIYA DESIGNS
          </p>

          <h1>
            Elegance
            <br />
            On Every Wrist
          </h1>

          <p>
            Discover beautiful bangles crafted
            to make every moment special.
          </p>

          <Link to="/shop" className="shop-button">
            SHOP COLLECTION
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>


      {/* CATEGORIES */}
      <section className="categories">

        <div className="section-heading">
          <p>EXPLORE</p>
          <h2>Shop By Category</h2>
        </div>

        <div className="category-grid">

          <div className="category-card">
            <div className="category-image">
              💍
            </div>
            <h3>Designer Bangles</h3>
            <p>Explore Collection</p>
          </div>

          <div className="category-card">
            <div className="category-image">
              👑
            </div>
            <h3>Bridal Bangles</h3>
            <p>Explore Collection</p>
          </div>

          <div className="category-card">
            <div className="category-image">
              ✨
            </div>
            <h3>Stone Bangles</h3>
            <p>Explore Collection</p>
          </div>

          <div className="category-card">
            <div className="category-image">
              🌸
            </div>
            <h3>Bangle Sets</h3>
            <p>Explore Collection</p>
          </div>

        </div>

      </section>


      {/* FEATURE SECTION */}
      <section className="feature">

        <div>
          <p>PRIYA DESIGNS</p>

          <h2>
            Beauty that
            <br />
            speaks for itself.
          </h2>

          <p>
            From traditional elegance to modern designs,
            find the perfect bangles for every occasion.
          </p>

          <Link to="/shop" className="outline-button">
            VIEW PRODUCTS
          </Link>
        </div>

      </section>

    </div>
  );
}

export default Home;