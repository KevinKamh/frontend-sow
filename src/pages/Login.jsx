import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useTranslation } from "react-i18next";
import { loadTranslations } from "../i18n";
import "./Login.css";

const languages = [
  { code: "sv", name: "Svenska", flag: "🇸🇪" },  
  { code: "en", name: "English", flag: "🇬🇧" },

];

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await api.post("/login", { email, password });
      if (res.data && res.data.token) {
        console.log("Login successful, received token:", res.data);
        login(res.data.token);
        navigate("/products");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("❌ Email o contraseña incorrectos");
      } else {
        alert("⚠️ Error de conexión con el servidor");
      }
      console.error("Detalle del error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="login-container">
   
      <div className="login-background"></div>

      <header className="login-header">
        <div className="header-logo">
          <img
            src="https://storage.123fakturera.se/public/icons/diamond.png"
            alt="Logo"
            className="logo-image"
          />
        </div>
        <nav className="header-nav">
          <a href="#" className="nav-link">{t("nav.home")}</a>
          <a href="#" className="nav-link">{t("nav.order")}</a>
          <a href="#" className="nav-link">{t("nav.customers")}</a>
          <a href="#" className="nav-link">{t("nav.about")}</a>
          <a href="#" className="nav-link">{t("nav.contact")}</a>
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
                      loadTranslations(lang.code);
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
        </nav>
      </header>

 
      <main className="login-main">
        <div className="login-card">
          <h1 className="login-title">{t("login.title")}</h1>

          {errorMessage && (
            <p style={{ color: "red", textAlign: "center", marginBottom: "10px" }}>
              {errorMessage}
            </p>
          )}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                {t("login.email")}
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Epost adress"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                {t("login.password")}
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="form-input"
                  placeholder="Lösenord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="login-button">
              {t("login.button")}
            </button>
          </form>

          <div className="login-links">
            <a href="#" className="login-link">Registrera dig</a>
            <a href="#" className="login-link">Glömt lösenord?</a>
          </div>
        </div>
      </main>

   
      <footer className="login-footer">
        <div className="footer-content">
          <span className="footer-brand">123 Fakturera</span>
          <nav className="footer-nav">
            <a href="#" className="footer-link">{t("nav.home")}</a>
            <a href="#" className="footer-link">{t("nav.order")}</a>
            <a href="#" className="footer-link">{t("nav.contact")}</a>
          </nav>
        </div>
        <div className="footer-copyright">
          © KevDev, 2026. All rights reserved.
        </div>
      </footer>
    </div>
  );
}