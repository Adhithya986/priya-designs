import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useCart } from "../components/CartContext.jsx";
import API_BASE_URL from "../api";

const categories = [
  "All",
  "Designer Bangles",
  "Bridal Bangles",
  "Stone Bangles",
  "Bangle Sets",
];

function Shop() {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    }
  }, [categoryFromUrl]);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
       `${API_BASE_URL}/api/products`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products"
        );
      }

      const normalized = (data.products || []).map((p) => {
        const id = String(p._id || p.id);
        return {
          ...p,
          id,
          _id: id,
        };
      });

      setProducts(normalized);
    } catch (error) {
      console.error(error);

      setError(
        "Unable to load products. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function handleCategoryClick(cat) {
    setSelectedCategory(cat);
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  }

  function handleAddToCart(product) {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  }

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category === selectedCategory
        );

  return (
    <div className="shop-page">

      {/* HEADER */}
      <section className="shop-header">

        <p>PRIYA DESIGNS</p>

        <h1>Our Collection</h1>

        <span>
          Discover beautiful bangles designed for every occasion.
        </span>

      </section>

      {/* CATEGORIES */}
      <section className="shop-categories">

        {categories.map((category) => (
          <button
            key={category}
            className={
              selectedCategory === category
                ? "category-button active"
                : "category-button"
            }
            onClick={() =>
              handleCategoryClick(category)
            }
          >
            {category}
          </button>
        ))}

      </section>

      {/* PRODUCTS */}
      <section className="products-section">

        {loading && (
          <div className="shop-message">
            <h2>Loading Collection...</h2>
            <p>Please wait while we fetch our products.</p>
          </div>
        )}

        {!loading && error && (
          <div className="shop-message">

            <h2>Oops!</h2>

            <p>{error}</p>

            <button
              className="retry-button"
              onClick={fetchProducts}
            >
              Try Again
            </button>

          </div>
        )}

        {!loading &&
          !error &&
          filteredProducts.length === 0 && (
            <div className="shop-message">

              <h2>No Products Found</h2>

              <p>
                There are no products in this category yet.
              </p>

            </div>
          )}

        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <div className="product-grid">

              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={{
                    ...product,
                    id: product._id,
                  }}
                  onAddToCart={handleAddToCart}
                />
              ))}

            </div>
          )}

      </section>

    </div>
  );
}

export default Shop;