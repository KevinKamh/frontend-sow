"use client";

import { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import "./products.css";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "sv", name: "Svenska", flag: "🇸🇪" },
];

const menuItems = [
  { icon: "📄", label: "Invoices", active: false },
  { icon: "👥", label: "Customers", active: false },
  { icon: "⚙️", label: "My Business", active: false },
  { icon: "📒", label: "Invoice Journal", active: false },
  { icon: "🏷️", label: "Price List", active: true, hasIndicator: true },
  { icon: "📑", label: "Multiple Invoicing", active: false },
  { icon: "❌", label: "Unpaid Invoices", active: false },
  { icon: "🎁", label: "Offer", active: false },
  { icon: "📦", label: "Inventory Control", active: false, disabled: true },
  { icon: "👤", label: "Member Invoicing", active: false, disabled: true },
  { icon: "☁️", label: "Import/Export", active: false },
  { icon: "🚪", label: "Log out", active: false },
];

export default function ProductsPage() {
  const { token } = useContext(AuthContext);
  const { t } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [searchArticle, setSearchArticle] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [activeMenu, setActiveMenu] = useState("Price List");
  const [userName, setUserName] = useState("");
  const [userPosition, setUserPosition] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!token) return;
    api
      .get("/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProducts(res.data))
      .catch((err) =>
        console.error("Error loading products:", err.response?.status)
      );


    api
      .get("/user-info", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUserName(res.data.user_login);
        setUserPosition(res.data.position);
      })
      .catch((err) =>
        console.error("Error loading user info:", err.response?.status)
      );
  }, [token]);


  const updateProduct = (article_no, field, value) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.article_no === article_no ? { ...p, [field]: value } : p
      )
    );
  };

 
  const handleKeyDown = (e, p) => {
    if (e.key === "Enter") {
      api
        .put(`/products/${p.article_no}`, p, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
          console.log(`Product ${p.article_no} updated`);
          e.target.blur();
        })
        .catch(() => alert("Error: Could not save changes."));
    }
  };

 
  const filtered = products.filter((p) => {
    const matchArticle = p.article_no
      ?.toString()
      .toLowerCase()
      .includes(searchArticle.toLowerCase());
    const matchProduct = p.product
      ?.toLowerCase()
      .includes(searchProduct.toLowerCase());
    return matchArticle && matchProduct;
  });

  return (
    <div className="products-container">

      <header className="products-header">
        <button
          className="hamburger-menu"
          onClick={() => setShowSidebar(!showSidebar)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="header-user">
          <div className="user-avatar">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=john"
              alt="User Avatar"
              className="avatar-image"
            />
            <span className="avatar-status"></span>
          </div>
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-company">{userPosition}</span>
          </div>
        </div>

        <div className="header-language">
          <div className="language-selector">
            <button
              className="language-button"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              <span>{selectedLanguage.name}</span>
              <span className="flag-icon">{selectedLanguage.flag}</span>
            </button>
            {showLanguageDropdown && (
              <div className="language-dropdown">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className="language-option"
                    onClick={() => {
                      setSelectedLanguage(lang);
                      setShowLanguageDropdown(false);
                    }}
                  >
                    <span>{lang.name}</span>
                    <span className="flag-icon">{lang.flag}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="products-body">
       
        {showSidebar && (
          <div
            className="sidebar-overlay"
            onClick={() => setShowSidebar(false)}
          ></div>
        )}
       
        <aside className={`products-sidebar ${showSidebar ? "show" : ""}`}>
          <div className="sidebar-title">Menu</div>
          <nav className="sidebar-nav">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`sidebar-item ${item.active ? "active" : ""} ${
                  item.disabled ? "disabled" : ""
                }`}
                onClick={() => {
                  if (!item.disabled) {
                    setActiveMenu(item.label);
                    setShowSidebar(false);
                  }
                }}
              >
                {item.hasIndicator && (
                  <span className="item-indicator"></span>
                )}
                <span className="item-icon">{item.icon}</span>
                <span className="item-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

     
        <main className="products-main">
          
          <div className="products-toolbar">
            <div className="search-fields">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search Article No..."
                  value={searchArticle}
                  onChange={(e) => setSearchArticle(e.target.value)}
                />
                <button className="search-button">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>
              <div className="search-input-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search Product ..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                />
                <button className="search-button">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button className="action-button">
                <span>New Product</span>
                <span className="button-icon green">+</span>
              </button>
              <button className="action-button">
                <span>Print List</span>
                <span className="button-icon blue">🖨️</span>
              </button>
              <button className="action-button">
                <span>Advanced mode</span>
                <span className="button-icon orange">⚙️</span>
              </button>
            </div>
          </div>

         
          <div className="products-table-wrapper">
            <table className="products-table">
              <thead>
                <tr>
               
                  <th className="col-arrow"></th>

           
                  <th className="col-article">
                    <span className="th-content">
                      Article No.
                      <svg
                        className="sort-icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2"
                      >
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                      </svg>
                    </span>
                  </th>

                 
                  <th className="col-product">
                    <span className="th-content">
                      Product/Service
                      <svg
                        className="sort-icon"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2"
                      >
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                      </svg>
                    </span>
                  </th>

                
                  <th className="col-price">Price</th>

                  
                  <th className="col-total">Total</th>

                 
                  <th className="col-unit">Unit</th>

                 
                  <th className="col-stock">Stock</th>

                 
                  <th className="col-description">Description</th>

             
                  <th className="col-more"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.article_no}>
                
                    <td className="col-arrow">
                      <span className="row-arrow">→</span>
                    </td>

                   
                    <td className="col-article">
                      <span className="cell-value">{p.article_no}</span>
                    </td>

                    <td className="col-product">
                      <input
                        className="cell-input"
                        value={p.product || ""}
                        onChange={(e) =>
                          updateProduct(p.article_no, "product", e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, p)}
                      />
                    </td>

           
                    <td className="col-price">
                      <input
                        className="cell-input"
                        type="number"
                        value={p.price || 0}
                        onChange={(e) =>
                          updateProduct(p.article_no, "price", e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, p)}
                      />
                    </td>

                  
                    <td className="col-total">
                      <input
                        className="cell-input"
                        type="number"
                        value={p.price_total || 0}
                        onChange={(e) =>
                          updateProduct(
                            p.article_no,
                            "price_total",
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => handleKeyDown(e, p)}
                      />
                    </td>

                   
                    <td className="col-unit">
                      <input
                        className="cell-input"
                        value={p.unit || ""}
                        onChange={(e) =>
                          updateProduct(p.article_no, "unit", e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, p)}
                      />
                    </td>

                   
                    <td className="col-stock">
                      <input
                        className="cell-input"
                        type="number"
                        value={p.stock || 0}
                        onChange={(e) =>
                          updateProduct(p.article_no, "stock", e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(e, p)}
                      />
                    </td>

                    <td className="col-description">
                      <input
                        className="cell-input"
                        value={p.description || ""}
                        onChange={(e) =>
                          updateProduct(
                            p.article_no,
                            "description",
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => handleKeyDown(e, p)}
                      />
                    </td>

                    <td className="col-more">
                      <button className="more-button">•••</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}