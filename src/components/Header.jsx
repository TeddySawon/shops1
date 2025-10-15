import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/header.css";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className={`main-header ${scrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <div className="logo-icon">M</div>
          <span className="logo-text">MePrice</span>
        </Link>

        {/* Navigation */}
        <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
          <Link
            to="/shops1/homepage"
            className={`nav-item ${
              location.pathname === "/shops1/homepage" ? "active" : ""
            }`}
          >
            Homepage
          </Link>
          <Link
            to="/shops1/product/"
            className={`nav-item ${
              location.pathname === "/shops1/product/" ? "active" : ""
            }`}
          >
            Product
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={`menu-toggle ${scrolled ? "scrolled" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
          <span className={`bar ${menuOpen ? "open" : ""}`}></span>
        </button>
      </div>
    </header>
  );
}
