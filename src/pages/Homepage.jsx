import { useEffect, useState } from "react";
import "../css/Homepage.css";
import "../css/Global.css";
import Header from "../components/Header";

export default function Homepage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch("/api/barang/")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const all = data.data || [];
        const grouped = {};
        all.forEach((item) => {
          if (!grouped[item.tipe]) grouped[item.tipe] = [];
          if (grouped[item.tipe].length < 3) grouped[item.tipe].push(item);
        });
        setProducts(Object.values(grouped).flat());
        setLoading(false);
      })
      .catch((err) => {
        console.error("There is an error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const categories = ["all", ...new Set(products.map((p) => p.tipe))];
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.nama
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.tipe === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600 text-lg">Contains the best products...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="error-card glass-effect p-8 rounded-2xl text-center">
          <div className="error-icon mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Oops! There is an error
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="homepage-container">
      <Header />

      {/* Hero Section with Parallax Effect */}
      <section className="hero-section gradient-purple-blue shadow-custom">
        <div className="hero-content w-full text-center text-white px-6">
          <div className="hero-badge mb-6 animate-float">
            <span className="badge-text">✨ Platform E-Commerce Terpercaya</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-slideDown">
            Selamat Datang di <span className="text-glow">MePrice</span>
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto animate-slideUp">
            Temukan berbagai produk terbaik dengan harga terjangkau dan kualitas
            terjamin
          </p>

          {/* Search Bar in Hero */}
          <div className="search-hero max-w-2xl mx-auto animate-fadeIn">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk impian Anda..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input-hero w-full px-6 py-4 pr-14 rounded-full text-gray-800 text-lg"
              />
              <button className="search-btn-hero absolute right-2 top-1/2 transform -translate-y-1/2">
                🔍
              </button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="hero-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="category-section px-6 py-8 bg-white sticky top-16 z-40 shadow-md">
        <div className="max-w-1200 mx-auto">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 hide-scrollbar">
            <span className="text-gray-700 font-semibold whitespace-nowrap">
              Kategori:
            </span>
            {categories.map((cat, index) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`category-btn ${
                  selectedCategory === cat ? "active" : ""
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {cat === "all" ? "Semua Produk" : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="products-section px-6 py-12">
        <div className="max-w-1200 mx-auto">
          {/* Section Header */}
          <div className="section-header text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">
              Product choice{" "}
              <span className="gradient-text">Featured</span>
            </h2>
            <p className="text-gray-600 text-lg">
              {filteredProducts.length} products are available to you
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="empty-state text-center py-20">
              <div className="empty-icon mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Product Not Found
              </h3>
              <p className="text-gray-500">
                Try changing your keywords or search categories
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((item, index) => (
                <div
                  key={item.id}
                  className="product-card glass-effect shadow-custom hover:shadow-hover transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Product Image */}
                  <div className="product-image-wrapper relative overflow-hidden">
                    {item.gambar ? (
                      <img
                        src={item.gambar}
                        alt={item.nama}
                        className="product-image"
                      />
                    ) : (
                      <div className="product-image bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400">
                        <span className="text-6xl">📦</span>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="category-badge absolute top-3 left-3">
                      {item.tipe}
                    </div>

                    {/* Hover Overlay */}
                    <div
                      className={`product-overlay ${
                        hoveredCard === item.id ? "active" : ""
                      }`}
                    >
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1">
                      {item.nama}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.deskripsi || "Produk berkualitas dengan harga terbaik"}
                    </p>

                    {/* Price & Action */}
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Harga</p>
                        <span className="text-blue-600 font-bold text-xl">
                          Rp {item.harga?.toLocaleString("id-ID") || item.harga}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Shine Effect */}
                  <div className="card-shine"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-1200 mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose MePrice?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card text-center p-6 animate-fadeIn">
              <div className="feature-icon mb-4">🚚</div>
              <h3 className="font-bold text-xl mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                The product arrives quickly and safely in your hands
              </p>
            </div>
            <div className="feature-card text-center p-6 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
              <div className="feature-icon mb-4">💳</div>
              <h3 className="font-bold text-xl mb-2">Payment is easy</h3>
              <p className="text-gray-600">
                Various payment methods for your convenience
              </p>
            </div>
            <div className="feature-card text-center p-6 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
              <div className="feature-icon mb-4">⭐</div>
              <h3 className="font-bold text-xl mb-2">Quality Products</h3>
              <p className="text-gray-600">
                Only the best products with guaranteed quality
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}