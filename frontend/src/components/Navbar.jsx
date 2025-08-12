import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar({ lang, setLang }) {
  const navLinks = [
    { to: "/news", label: lang === "ar" ? "الأخبار" : "News" },
    { to: "/news/new", label: lang === "ar" ? "إضافة خبر" : "Add News" },
    { to: "/login", label: lang === "ar" ? "تسجيل الدخول" : "Login" },
  ];

  return (
    <nav className="bg-green-600 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/" className="text-xl font-bold text-white">
          City News
        </Link>
        <div className="flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded transition ${
                  isActive
                    ? "bg-green-800 text-white font-semibold"
                    : "text-white hover:bg-green-700"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {/* Language switcher */}
          <div className="flex items-center ml-4">
            <button
              className={`px-2 py-1 rounded-l transition ${
                lang === "fr"
                  ? "bg-green-800 text-white"
                  : "bg-white text-green-700 hover:bg-green-700 hover:text-white"
              }`}
              onClick={() => setLang("fr")}
            >
              FR
            </button>
            <button
              className={`px-2 py-1 rounded-r transition ${
                lang === "ar"
                  ? "bg-green-800 text-white"
                  : "bg-white text-green-700 hover:bg-green-700 hover:text-white"
              }`}
              onClick={() => setLang("ar")}
            >
              AR
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
