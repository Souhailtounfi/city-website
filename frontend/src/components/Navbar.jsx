import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import NavNewsTicker from "./NavNewsTicker";

export default function FuturisticNavbar() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language;
  const dir = i18n.dir(lang);
  const { user, logout } = useAuth();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [spacerH, setSpacerH] = useState(0);

  const fixedWrapRef = useRef(null);
  const closeTimer = useRef(null);

  const buildGroups = useCallback(() => {
    const isAr = lang.startsWith("ar");
    const L = (fr, ar) => (isAr ? ar : fr);

    return [
      {
        key: "gen",
        to: "/presentation-generale/apercu-historique",
        label: L("PRESENTATION GENERALE DE LA PROVINCE", "العرض العام للإقليم"),
        items: [
          { to: "/presentation-generale/apercu-historique", label: L("Aperçu Historique", "لمحة تاريخية") },
          { to: "/presentation-generale/situation-geographique", label: L("Situation Géographique", "الموقع الجغرافي") },
          { to: "/presentation-generale/organisation-administrative", label: L("Organisation Administrative", "التنظيم الإداري") },
          { to: "/presentation-generale/milieu-naturel", label: L("Milieu Naturel", "الوسط الطبيعي") },
          { to: "/presentation-generale/superficie-population", label: L("Superficie & Population", "المساحة و الساكنة") },
        ],
      },
      {
        key: "infra",
        to: "/infrastructures-base/reseau-routier",
        label: L("SECTEURS D’INFRASTRUCTURES DE BASE", "قطاعات البنية التحتية الأساسية"),
        items: [
          { to: "/infrastructures-base/reseau-routier", label: L("Réseau Routier", "الشبكة الطرقية") },
          { to: "/infrastructures-base/eau-potable", label: L("L’Eau Potable", "ماء الشرب") },
          { to: "/infrastructures-base/electricite", label: L("L’Électricité", "الكهرباء") },
          { to: "/infrastructures-base/habitat", label: L("Habitat", "السكن") },
          { to: "/infrastructures-base/environnement", label: L("Environnement", "البيئة") },
        ],
      },
      {
        key: "soc",
        to: "/secteurs-sociaux/enseignement",
        label: L("SECTEURS SOCIAUX", "القطاعات الاجتماعية"),
        items: [
          { to: "/secteurs-sociaux/enseignement", label: L("Enseignement", "التعليم") },
          { to: "/secteurs-sociaux/formation-professionnelle", label: L("Formation Professionnelle", "التكوين المهني") },
          { to: "/secteurs-sociaux/sante", label: L("La Santé", "الصحة") },
            { to: "/secteurs-sociaux/protection-civile", label: L("Protection Civile", "الحماية المدنية") },
          { to: "/secteurs-sociaux/entraide-associatif", label: L("Entraide Nationale & Tissu Associatif", "التعاون الوطني والنسيج الجمعوي") },
          { to: "/secteurs-sociaux/jeunesse-sports", label: L("Jeunesse & Sports", "الشباب والرياضة") },
          { to: "/secteurs-sociaux/indh", label: L("INDH", "المبادرة الوطنية للتنمية البشرية") },
          { to: "/secteurs-sociaux/secteur-prive", label: L("Secteur Privé", "القطاع الخاص") },
          { to: "/secteurs-sociaux/champ-religieux", label: L("Champ Religieux", "الحقل الديني") },
        ],
      },
      {
        key: "prod",
        to: "/secteurs-productifs/agriculture",
        label: L("SECTEURS PRODUCTIFS", "القطاعات الإنتاجية"),
        items: [
          { to: "/secteurs-productifs/agriculture", label: L("Agriculture", "الفلاحة") },
          { to: "/secteurs-productifs/carrieres", label: L("Carrières", "المقالع") },
          { to: "/secteurs-productifs/eaux-forets", label: L("Eaux & Forêts", "المياه والغابات") },
          { to: "/secteurs-productifs/industrie-commerce", label: L("Industrie & Commerce", "الصناعة و التجارة") },
          { to: "/secteurs-productifs/tourisme", label: L("Tourisme", "السياحة") },
          { to: "/secteurs-productifs/artisanat", label: L("Artisanat", "الصناعة التقليدية") },
          { to: "/secteurs-productifs/banque-donnees-investissements", label: L("Banque de Données des Investissements", "البنك المعطيات للاستثمار") },
        ],
      },
    ];
  }, [lang]);

  const groups = buildGroups();

  const singles = [
    { to: "/news", label: lang.startsWith("ar") ? "الأخبار" : t("news") },
    ...(user?.is_admin ? [{ to: "/news/new", label: lang.startsWith("ar") ? "إضافة خبر" : t("add_news") }] : []),
    ...(!user ? [{ to: "/login", label: lang.startsWith("ar") ? "تسجيل الدخول" : t("login") }] : []),
  ];

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved !== lang) i18n.changeLanguage(saved);
  }, [i18n, lang]);

  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenGroup(null);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const recalcSpacer = useCallback(() => {
    if (fixedWrapRef.current) {
      setSpacerH(fixedWrapRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    recalcSpacer();
  }, [lang, recalcSpacer]);

  useEffect(()=>{
    const h = () => recalcSpacer();
    window.addEventListener("navTickerResize", h);
    return ()=>window.removeEventListener("navTickerResize", h);
  },[recalcSpacer]);

  const handleLangSwitch = async (lng) => {
    if (lng === lang) return;
    await i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    setOpenGroup(null);
  };

  const openWithDelay = (key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenGroup(key);
  };
  const scheduleClose = (key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpenGroup((k) => (k === key ? null : k));
    }, 180); // small delay
  };

  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 38s linear infinite; }
        .group:hover .animate-marquee { animation-play-state: paused; }
        .nav-btn:after {
          content:"";
          position:absolute;
          inset:0;
          background:linear-gradient(140deg,rgba(255,255,255,0.45),rgba(255,255,255,0));
          opacity:0;
          transition:.35s;
          pointer-events:none;
        }
        .nav-btn:hover:after { opacity:1; }
        .dropdown-panel::-webkit-scrollbar{width:6px}
        .dropdown-panel::-webkit-scrollbar-track{background:transparent}
        .dropdown-panel::-webkit-scrollbar-thumb{background:#10b98155;border-radius:3px}
        .admin-create-btn{
          position:relative;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap:.55rem;
          height:44px;
          padding:0 1.4rem;
          border-radius:1.7rem;
          font-size:.68rem;
          font-weight:800;
          letter-spacing:.12em;
          text-transform:uppercase;
          text-decoration:none;
          background:linear-gradient(120deg,#6366f1,#3b82f6 35%,#0ea5e9 65%,#10b981);
          background-size:180% 100%;
          color:#fff;
          box-shadow:0 10px 28px -12px rgba(59,130,246,.55),0 6px 18px -8px rgba(14,165,233,.45);
          overflow:hidden;
          transition:.75s;
          border:1px solid rgba(255,255,255,.25);
        }
        .admin-create-btn:before{
          content:"";
          position:absolute;
            inset:0;
          background:linear-gradient(120deg,rgba(255,255,255,.55),transparent 60%);
          opacity:0;
          mix-blend-mode:overlay;
          transition:.6s;
        }
        .admin-create-btn:hover{
          background-position:100% 0;
          transform:translateY(-4px);
          box-shadow:0 18px 40px -14px rgba(59,130,246,.55),0 10px 28px -12px rgba(14,165,233,.5);
        }
        .admin-create-btn:hover:before{opacity:.85;}
        .admin-create-btn.is-active{
          box-shadow:0 0 0 3px rgba(255,255,255,.4),0 10px 26px -12px rgba(59,130,246,.6);
        }
        /* Mobile variant */
        .admin-create-btn.mobile{
          flex:1;
          min-width:150px;
          height:auto;
          padding:.95rem 1.3rem;
          font-size:.62rem;
        }
      `}</style>

      <div ref={fixedWrapRef} key={lang} className="fixed top-0 inset-x-0 z-50" dir={dir}>
        <NavNewsTicker lang={lang} />
        <nav
          className={`w-full transition-all duration-300 ${scrolled
              ? "bg-gradient-to-r from-green-800 via-green-700 to-green-800 shadow-[0_4px_22px_-4px_rgba(0,0,0,0.55)]"
              : "bg-gradient-to-r from-green-700 via-green-600 to-green-500"
            }`}
        >
          <div className="mx-auto max-w-[1500px] px-4 sm:px-6">
            <div className="flex items-center gap-6 py-2">
              <Link to="/" className="flex items-center gap-3 shrink-0 group/logo">
                <img
                  src={logo}
                  alt="Logo"
                  className="h-14 w-auto drop-shadow-md transition-transform group-hover/logo:scale-110"
                />
                <span className="font-extrabold tracking-wide text-xl sm:text-2xl text-white drop-shadow">
                  El Hajeb City
                </span>
              </Link>

              <div className="hidden lg:flex items-center gap-2 flex-1">
                {groups.map((g) => {
                  const isOpen = openGroup === g.key;
                  return (
                    <div
                      key={g.key}
                      className="relative"
                      onMouseEnter={() => openWithDelay(g.key)}
                      onMouseLeave={() => scheduleClose(g.key)}
                    >
                      <div className="flex">
                        <NavLink
                          to={g.to}
                          className={({ isActive }) =>
                            `nav-btn relative px-4 h-11 rounded-l-2xl text-[11px] font-semibold flex items-center transition ${
                              isActive
                                ? "bg-white text-green-700 shadow"
                                : "text-white/90 hover:bg-white/20"
                            }`
                          }
                        >
                          {g.label}
                        </NavLink>
                        <button
                          type="button"
                          aria-haspopup="true"
                          aria-expanded={isOpen}
                          onClick={() => setOpenGroup(isOpen ? null : g.key)}
                          className={`nav-btn relative px-2 h-11 rounded-r-2xl border-l border-white/20 flex items-center justify-center transition ${
                            isOpen
                              ? "bg-white text-green-700"
                              : "text-white/80 hover:bg-white/20"
                          }`}
                        >
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      <div
                        className={`absolute ${
                          dir === "rtl" ? "right-0" : "left-0"
                        } mt-2 w-72 p-2 rounded-2xl bg-white/95 backdrop-blur dropdown-panel ring-1 ring-green-100 transition-all origin-top ${
                          isOpen
                            ? "opacity-100 scale-100 pointer-events-auto"
                            : "opacity-0 scale-95 pointer-events-none"
                        }`}
                      >
                        <ul className="max-h-[60vh] overflow-auto pr-1">
                          {g.items.map((i) => (
                            <li key={i.to}>
                              <NavLink
                                to={i.to}
                                className={({ isActive }) =>
                                  `block px-4 py-2 rounded-xl text-[13px] tracking-wide transition ${
                                    isActive
                                      ? "bg-green-600 text-white font-semibold shadow"
                                      : "text-gray-700 hover:bg-green-100"
                                  }`
                                }
                              >
                                {i.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}

                {singles.map((s) => (
                  <NavLink
                    key={s.to}
                    to={s.to}
                    className={({ isActive }) =>
                      `nav-btn relative h-11 px-5 rounded-2xl text-sm font-semibold flex items-center transition ${
                        isActive
                          ? "bg-white text-green-700 shadow"
                          : "text-white/90 hover:bg-white/20"
                      }`
                    }
                  >
                    {s.label}
                  </NavLink>
                ))}

                {user?.is_admin && (
                  <NavLink
                    to="/users"
                    className={({ isActive }) =>
                      `admin-create-btn ${isActive ? "is-active" : ""}`
                    }
                  >
                    {lang.startsWith("ar") ? "إنشاء مدير" : "Créer Admin"}
                  </NavLink>
                )}

                {user && (
                  <button
                    onClick={logout}
                    className="nav-btn relative h-11 px-5 rounded-2xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition"
                  >
                    {lang.startsWith("ar") ? "تسجيل الخروج" : t("logout")}
                  </button>
                )}

                <div className="flex items-center bg-white/15 border border-white/30 rounded-full shadow px-1 py-1 ml-2 backdrop-blur">
                  <button
                    className={`flex items-center px-3 py-1 rounded-full transition text-xs font-bold ${
                      lang === "fr"
                        ? "bg-white text-green-700 shadow"
                        : "text-white/80 hover:bg-white/20"
                    }`}
                    onClick={() => handleLangSwitch("fr")}
                  >
                    FR
                  </button>
                  <button
                    className={`flex items-center px-3 py-1 rounded-full transition text-xs font-bold ${
                      lang === "ar"
                        ? "bg-white text-green-700 shadow"
                        : "text-white/80 hover:bg-white/20"
                    }`}
                    onClick={() => handleLangSwitch("ar")}
                  >
                    AR
                  </button>
                </div>
              </div>

              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="lg:hidden ml-auto nav-btn relative h-12 w-12 rounded-2xl flex items-center justify-center bg-white/90 text-green-700 hover:bg-white shadow transition"
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <svg className="w-6 h-6" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg className="w-7 h-7" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>

            <div
              className={`lg:hidden transition-all duration-400 overflow-hidden ${mobileOpen ? "max-h-[80vh] mb-4" : "max-h-0"
                }`}
            >
              <div className="rounded-2xl p-4 grid gap-4 bg-white/95 backdrop-blur shadow border border-green-100">
                {groups.map((g) => {
                  const open = openGroup === g.key;
                  return (
                    <div key={g.key} className="rounded-2xl border border-green-200/70 overflow-hidden">
                      <div className="flex">
                        <NavLink
                          to={g.to}
                          onClick={() => setMobileOpen(false)}
                          className={({ isActive }) =>
                            `flex-1 px-4 py-3 text-xs font-semibold ${
                              isActive
                                ? "bg-green-600 text-white"
                                : "text-green-800 hover:bg-green-100"
                            }`
                          }
                        >
                          {g.label}
                        </NavLink>
                        <button
                          onClick={() => setOpenGroup(open ? null : g.key)}
                          className={`px-4 py-3 border-l border-green-200 flex items-center justify-center ${
                            open
                              ? "bg-green-600 text-white"
                              : "text-green-700 hover:bg-green-100"
                          }`}
                        >
                          <svg
                            className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      <div
                        className={`bg-green-50 text-green-800 text-xs transition-all duration-300 ${
                          open ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <ul className="max-h-[60vh] overflow-auto pr-1">
                          {g.items.map((i) => (
                            <li key={i.to}>
                              <NavLink
                                to={i.to}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                  `block rounded-xl px-3 py-2 text-xs ${
                                    isActive
                                      ? "bg-green-500 text-white"
                                      : "hover:bg-green-100 text-green-800"
                                  }`
                                }
                              >
                                {i.label}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}

                <div className="flex flex-wrap gap-2">
                  {singles.map((s) => (
                    <NavLink
                      key={s.to}
                      to={s.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex-1 min-w-[120px] text-center px-4 py-3 rounded-2xl text-sm font-semibold ${isActive
                          ? "bg-green-600 text-white shadow"
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                        }`
                      }
                    >
                      {s.label}
                    </NavLink>
                  ))}
                  {user?.is_admin && (
                    <NavLink
                      to="/users"
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `admin-create-btn mobile ${isActive ? "is-active" : ""}`
                      }
                    >
                      {lang.startsWith("ar") ? "إنشاء مدير" : "Créer Admin"}
                    </NavLink>
                  )}
                  {user && (
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="flex-1 min-w-[120px] px-4 py-3 rounded-2xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white"
                    >
                      {lang.startsWith("ar") ? "تسجيل الخروج" : t("logout")}
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => handleLangSwitch("fr")}
                    className={`px-4 py-1 rounded-full text-sm font-bold ${
                      lang === "fr"
                        ? "bg-green-600 text-white shadow"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    FR
                  </button>
                  <button
                    onClick={() => handleLangSwitch("ar")}
                    className={`px-4 py-1 rounded-full text-sm font-bold ${
                      lang === "ar"
                        ? "bg-green-600 text-white shadow"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    AR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div style={{ height: spacerH }} />
    </>
  );
}
