import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleLangSwitch = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
  };

  const navItems = [
    {
      label: "PRESENTATION GENERALE DE LA PROVINCE",
      children: [
        { to: "/historique", label: "APERÇU HISTORIQUE" },
        { to: "/geographie", label: "SITUATION GEOGRAPHIQUE" },
      ],
    },
    {
      label: "SECTEURS D’INFRASTRUCTURES DE BASE",
      children: [
        { to: "/reseau-routiere", label: "Reseau routiere" },
        { to: "/eau-potable", label: "L'eay potable" },
        { to: "/electricite", label: "L'electricite" },
        { to: "/habitat", label: "Habitat" },
        { to: "/environnement", label: "environnement" },
      ],
    },
    {
      label: "SECTEURS Sociaux",
      children: [
        { to: "/enseignement", label: "Enseignement" },
        { to: "/sante", label: "sante" },
        { to: "/formation", label: "formation" },
        { to: "/protection", label: "Protection" },
      ],
    },
    {
      label: "Secteur productif",
      children: [
        { to: "/agriculture", label: "Agriculture" },
        { to: "/carrieres", label: "carrieres" },
        { to: "/eaux-forets", label: "eaux et forets" },
        { to: "/tourisme", label: "tourisme" },
        { to: "/artisanat", label: "artisanat" },
      ],
    },
    { to: "/news", label: t("news") },
    { to: "/news/new", label: t("add_news") },
    { to: "/login", label: t("login") },
  ];

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <>
      <nav className="bg-gradient-to-r from-green-700 via-green-500 to-green-400 shadow-lg fixed top-0 left-0 w-full z-50">
        {/* We make the navbar fixed at top so add padding-bottom later */}
        <div className="flex justify-between items-center h-20 max-w-full">
          {/* Logo + site name aligned left with no horizontal padding */}
          <Link
            to="/"
            className="flex items-center space-x-2 flex-shrink-0 pl-3"
            style={{ minWidth: 64 }}
          >
            <img
              src={logo}
              alt="Logo"
              className="h-16 w-auto object-contain"
            />
            <span className="text-white font-extrabold text-2xl tracking-wide drop-shadow-lg whitespace-nowrap">
              El Hajeb City
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4 pr-6">
            {navItems.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className="inline-flex items-center px-3 py-2 rounded-md font-semibold text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    {item.label}
                    <svg
                      className="ml-1 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div
                    className={`absolute left-0 mt-1 w-56 bg-white rounded-md shadow-lg transition-opacity duration-200 ${
                      openDropdown === item.label ? "opacity-100 visible" : "opacity-0 invisible"
                    } z-30`}
                  >
                    <div className="py-2">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) =>
                            `block px-4 py-2 text-gray-800 hover:bg-green-100 ${
                              isActive ? "font-bold bg-green-200" : ""
                            }`
                          }
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md font-semibold text-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-white text-green-700 shadow"
                        : "text-white hover:bg-green-800 hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              )
            )}

            {/* Language switcher */}
            <div className="flex items-center ml-4 bg-white rounded-full shadow px-1 py-1">
              <button
                className={`flex items-center px-2 py-0.5 rounded-full transition-all duration-200 font-bold text-lg ${
                  lang === "fr"
                    ? "bg-green-600 text-white shadow"
                    : "text-green-700 hover:bg-green-100"
                }`}
                onClick={() => handleLangSwitch("fr")}
                aria-label="Switch to French"
              >
                🇫🇷 <span className="ml-1"> FR</span>
              </button>
              <button
                className={`flex items-center px-2 py-0.5 rounded-full transition-all duration-200 font-bold text-lg ${
                  lang === "ar"
                    ? "bg-green-600 text-white shadow"
                    : "text-green-700 hover:bg-green-100"
                }`}
                onClick={() => handleLangSwitch("ar")}
                aria-label="Switch to Arabic"
              >
                <span className="mr-1">AR <img src="" alt="" /></span> 🇲🇦
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center pr-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-green-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Add padding top to the next content to avoid overlap with fixed navbar */}
      <div className="pt-20" />

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-green-600 fixed top-20 left-0 right-0 z-40">
          <nav className="px-2 pt-2 pb-4 space-y-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setOpenDropdown(openDropdown === item.label ? null : item.label)
                    }
                    className="w-full flex justify-between items-center px-3 py-2 text-white font-semibold rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <span>{item.label}</span>
                    <svg
                      className={`h-5 w-5 transform transition-transform ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openDropdown === item.label && (
                    <div className="pl-5 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          className={({ isActive }) =>
                            `block px-3 py-1 rounded text-white hover:bg-green-800 ${
                              isActive ? "font-bold underline" : ""
                            }`
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded text-white font-semibold hover:bg-green-800 ${
                      isActive ? "bg-green-900" : ""
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              )
            )}

            {/* Mobile language switcher */}
            <div className="flex items-center justify-center space-x-3 mt-3 bg-white rounded-full px-3 py-1">
              <button
                className={`font-bold text-lg rounded-full px-2 py-0.5 ${
                  lang === "fr" ? "bg-green-600 text-white" : "text-green-700"
                }`}
                onClick={() => handleLangSwitch("fr")}
              >
                🇫🇷 FR
              </button>
              <button
                className={`font-bold text-lg rounded-full px-2 py-0.5 ${
                  lang === "ar" ? "bg-green-600 text-white" : "text-green-700"
                }`}
                onClick={() => handleLangSwitch("ar")}
              >
                AR 🇲🇦
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
