import { useEffect, useState, useMemo } from "react";
import Header from "../components/Header"; // Asumsi ada komponen Header
import "../css/product.css"; 

// Komponen Modal Pembayaran
const CheckoutModal = ({ isOpen, onClose, purchaseInfo }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-green-600 mb-4 flex items-center">
          <span className="mr-2 text-3xl">✅</span> Pembayaran Berhasil!
        </h2>
        <p className="text-gray-700 mb-4">
          Terima kasih atas pembelian Anda. Berikut detailnya:
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm">
          <p className="font-semibold mb-2">Item yang Dibeli ({purchaseInfo.totalItems} Produk):</p>
          <ul className="list-disc ml-5 space-y-1 max-h-40 overflow-y-auto pr-2">
            {purchaseInfo.items.map((item) => (
              <li key={item.id} className="text-gray-600">
                {item.nama} (x{item.qty}) - Rp {(item.harga * item.qty).toLocaleString("id-ID")}
              </li>
            ))}
          </ul>
        </div>
        
        <p className="text-xl font-bold text-gray-800 mb-6">
          Total Pembayaran:{" "}
          <span className="text-red-500">
            Rp {purchaseInfo.totalPrice.toLocaleString("id-ID")}
          </span>
        </p>

        <button
          onClick={onClose}
          className="checkout-btn bg-steel-blue hover:bg-pastel-purple"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default function ProductPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseData, setPurchaseData] = useState(null);

  useEffect(() => {
    // Simulasi pemanggilan API
    fetch("https://mepriceapi.vercel.app/barang/")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setAllProducts(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Terjadi kesalahan:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Ambil daftar kategori unik untuk filter
  const categories = ["all", ...new Set(allProducts.map((p) => p.tipe))];

  // LOGIKA PENCARIAN, FILTER, DAN SORTING
  const filteredAndSortedProducts = useMemo(() => {
    let currentProducts = allProducts.filter((product) => {
      const matchesSearch = product.nama
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterType === "all" || product.tipe === filterType;
      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case "name-asc":
        currentProducts.sort((a, b) => a.nama.localeCompare(b.nama));
        break;
      case "name-desc":
        currentProducts.sort((a, b) => b.nama.localeCompare(a.nama));
        break;
      case "price-asc":
        currentProducts.sort((a, b) => a.harga - b.harga);
        break;
      case "price-desc":
        currentProducts.sort((a, b) => b.harga - a.harga);
        break;
      default:
        // Biarkan urutan asli dari API
        break;
    }

    return currentProducts;
  }, [allProducts, searchTerm, filterType, sortBy]);

  // LOGIKA KERANJANG
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Jika produk sudah ada, tingkatkan kuantitas
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        // Jika produk belum ada, tambahkan dengan kuantitas 1
        return [...prevCart, { ...product, qty: 1 }];
      }
    });
    // Buka keranjang saat menambahkan item
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };
  
  const updateCartQuantity = (productId, change) => {
    setCart((prevCart) => {
      const updatedCart = prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.qty + change;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean); // Hapus item jika qty <= 0
      return updatedCart;
    });
  };

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.harga * item.qty,
    0
  );
  
  const totalCartItems = cart.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  // LOGIKA PEMBAYARAN
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Keranjang Anda kosong!");
      return;
    }

    const purchaseDetails = {
      items: cart,
      totalPrice: cartTotal,
      totalItems: totalCartItems,
      date: new Date().toLocaleString(),
    };

    setPurchaseData(purchaseDetails);
    setIsModalOpen(true); // Tampilkan modal
    setCart([]); // Reset keranjang
    setIsCartOpen(false); // Tutup sidebar keranjang
  };


  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Memuat data produk...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="error-card glass-effect p-8 rounded-2xl text-center">
          <div className="error-icon mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">
            Oops! Terjadi Kesalahan
          </h3>
          <p className="text-gray-600">Gagal memuat produk: {error}</p>
        </div>
      </div>
    );

  return (
    <div className="product-page-container">
      <Header />
      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        purchaseInfo={purchaseData} 
      />

      <div className="max-w-1400 px-6 py-8">
        <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
          All Products <span className="gradient-text">MePrice</span>
        </h1>

        {/* CONTROLS: SEARCH, FILTER, SORT */}
        <div className="controls-bar">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <input
              type="text"
              placeholder="Search for product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-product w-full md:w-1/3"
            />

            {/* Filter by Type */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <label htmlFor="filterType" className="font-medium text-gray-600 whitespace-nowrap">Type:</label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-select w-full"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? "All Type" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <label htmlFor="sortBy" className="font-medium text-gray-600 whitespace-nowrap">Sort:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-select w-full"
              >
                <option value="default">Default</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Cheapest)</option>
                <option value="price-desc">Price (Expensive)</option>
              </select>
            </div>
          </div>
        </div>

        {/* PRODUCTS GRID */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="empty-state text-center py-20">
              <div className="empty-icon mb-4">😔</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Produk Tidak Ditemukan
              </h3>
              <p className="text-gray-500">
                Coba ubah kata kunci atau kriteria filter Anda
              </p>
            </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((item) => (
              <div
                key={item.id}
                className="product-card shadow-custom hover:shadow-hover"
              >
                {/* Product Image */}
                <div className="product-image-wrapper relative overflow-hidden rounded-t-lg">
                    {item.gambar ? (
                      <img
                        src={item.gambar}
                        alt={item.nama}
                        className="product-image transition-transform duration-500 hover:scale-105"
                      />
                    ) : (
                      <div className="product-image bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                    <div className="category-badge absolute top-3 left-3">
                        {item.tipe}
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-1 line-clamp-1 text-gray-800">{item.nama}</h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {item.deskripsi || "Deskripsi produk belum tersedia"}
                  </p>
                  
                  {/* Price & Action */}
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-blue-600 font-bold text-2xl">
                      Rp {item.harga?.toLocaleString("id-ID") || item.harga}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="add-to-cart-btn flex items-center gap-1"
                    >
                      <span className="text-lg"></span> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FLOATING CART BUTTON */}
      <div 
        className="cart-float-btn"
        onClick={() => setIsCartOpen(!isCartOpen)}
      >
        🛒
        {totalCartItems > 0 && <span className="cart-count">{totalCartItems}</span>}
      </div>


      {/* CART SIDEBAR */}
      <div className={`cart-sidebar ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Shopping cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="close-btn">
            &times;
          </button>
        </div>

        <div className="p-4 flex flex-col h-[calc(100vh-140px)]">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">The basket is still empty.</p>
          ) : (
            <>
              {/* Cart Items List */}
              <div className="space-y-3 overflow-y-auto pr-2 flex-grow">
                {cart.map((item) => (
                  <div key={item.id} className="cart-item-card p-3 flex items-center gap-3">
                    {/* Item Image */}
                    {item.gambar ? (
                      <img src={item.gambar} alt={item.nama} className="w-16 h-16 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">📦</div>
                    )}

                    {/* Item Details */}
                    <div className="flex-grow">
                      <h3 className="font-semibold line-clamp-1">{item.nama}</h3>
                      <p className="text-sm text-blue-600 font-bold">
                        Rp {(item.harga * item.qty).toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs text-gray-500">
                        @Rp {item.harga.toLocaleString("id-ID")}
                      </p>
                    </div>
                    
                    {/* Quantity Control */}
                    <div className="flex items-center border border-gray-300 rounded">
                        <button 
                            onClick={() => updateCartQuantity(item.id, -1)} 
                            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100"
                        >
                            -
                        </button>
                        <span className="w-8 text-center font-medium text-gray-800">{item.qty}</span>
                        <button 
                            onClick={() => updateCartQuantity(item.id, 1)} 
                            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100"
                        >
                            +
                        </button>
                    </div>

                    {/* Remove Button */}
                    <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="remove-item-btn ml-2"
                        title="Hapus item"
                    >
                        &times;
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Footer / Checkout */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-700">Total:</span>
                  <span className="text-2xl font-bold text-red-500">
                    Rp {cartTotal.toLocaleString("id-ID")}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="checkout-btn"
                  disabled={cart.length === 0}
                >
                  Pay now ({totalCartItems})
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}