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
  const desktopNavRef = useRef(null);
  const hoverTimer = useRef(null);
  const leaveTimer = useRef(null);

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
          { to: "/secteurs-productifs/banque-donnees-investissements", label: L("Banque de Données des Investissements", "بنك معطيات الاستثمارات") },
          { to: "/secteurs-productifs/contacts-utiles", label: L("Contacts Utiles", "جهات مفيدة") },
        ],
      },
    ];
  }, [lang]);

  const groups = buildGroups();
  const singles = [
    { to: "/news", label: lang.startsWith("ar") ? "الأخبار" : "Actualités" },
    ...(user?.is_admin ? [{ to: "/news/new", label: lang.startsWith("ar") ? "إضافة خبر" : t("add_news") }] : []),
    ...(!user ? [{ to: "/login", label: lang.startsWith("ar") ? "تسجيل الدخول" : t("login") }] : []),
  ];

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved !== lang) i18n.changeLanguage(saved);
  }, [i18n, lang]);

  useEffect(() => { document.documentElement.dir = dir; }, [dir]);
  useEffect(() => { setMobileOpen(false); setOpenGroup(null); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const recalcSpacer = useCallback(() => {
    if (fixedWrapRef.current) setSpacerH(fixedWrapRef.current.offsetHeight);
  }, []);
  useEffect(() => { recalcSpacer(); }, [lang, recalcSpacer]);
  useEffect(() => {
    const h = () => recalcSpacer();
    window.addEventListener("navTickerResize", h);
    window.addEventListener("resize", h);
    return () => {
      window.removeEventListener("navTickerResize", h);
      window.removeEventListener("resize", h);
    };
  }, [recalcSpacer]);

  useEffect(() => {
    const clickOutside = e => {
      if (!desktopNavRef.current) return;
      if (!desktopNavRef.current.contains(e.target)) setOpenGroup(null);
    };
    document.addEventListener("mousedown", clickOutside);
    document.addEventListener("touchstart", clickOutside);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
      document.removeEventListener("touchstart", clickOutside);
    };
  }, []);

  const handleLangSwitch = async (lng) => {
    if (lng === lang) return;
    await i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    setOpenGroup(null);
  };

  const handleEnter = (key) => {
    if (window.innerWidth < 1024) return;
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    hoverTimer.current = setTimeout(() => setOpenGroup(key), 110);
  };
  const handleLeave = (key) => {
    if (window.innerWidth < 1024) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    leaveTimer.current = setTimeout(() => {
      setOpenGroup(k => (k === key ? null : k));
    }, 150);
  };

  const compact = !!user?.is_admin;

  return (
    <>
      <style>{`
        .nav-root[data-compact="false"]{--gp-width:190px;--gp-height:44px;--gp-font:.6rem;}
        .nav-root[data-compact="true"]{--gp-width:165px;--gp-height:40px;--gp-font:.53rem;}
        @media (max-width:1350px){
          .nav-root[data-compact="false"]{--gp-width:180px;}
          .nav-root[data-compact="true"]{--gp-width:155px;}
        }
        @media (max-width:1180px){
          .nav-root[data-compact="false"]{--gp-width:170px;}
          .nav-root[data-compact="true"]{--gp-width:145px;}
        }
        .nav-outer-padding{padding-inline:.75rem;}
        @media (min-width:640px){.nav-outer-padding{padding-inline:1.1rem;}}
        @media (min-width:1280px){.nav-outer-padding{padding-inline:1.4rem;}}
        .layout-bar{display:flex;align-items:center;gap:1rem;}
        .brand-wrapper{display:flex;align-items:center;gap:.45rem;margin-left:-4px;}
        .brand-wrapper img{height:44px;width:auto;}
        .brand-name{font-size:clamp(.9rem,1.05vw,1.15rem);font-weight:800;color:#fff;white-space:nowrap;}
        .center-nav-wrapper{flex:1;display:flex;justify-content:center; /* center titles */ }
        .center-nav-inner{display:flex;flex-wrap:nowrap;gap:.55rem;position:relative;overflow:visible;}
        .center-nav-inner::-webkit-scrollbar{display:none;}
        .group-wrapper{position:relative;flex:0 0 auto;}
        .group-pill{
          --grad:linear-gradient(135deg,#065f46,#059669 55%,#10b981);
          width:var(--gp-width);height:var(--gp-height);
          padding:0 .65rem;border-radius:.95rem;
          display:flex;align-items:center;justify-content:center;
          font-size:var(--gp-font);font-weight:700;letter-spacing:.05em;
          text-transform:uppercase;color:#fff;background:var(--grad);
          border:1px solid #0fae7c66;cursor:pointer;
          transition:filter .25s, box-shadow .25s;
        }
        .group-pill:hover{filter:brightness(1.07);box-shadow:0 4px 14px -6px rgba(16,185,129,.45);}
        .group-pill.active{box-shadow:0 0 0 1px #10b981aa,0 6px 18px -10px rgba(15,174,124,.5);}
        .group-pill.open{box-shadow:0 0 0 2px rgba(255,255,255,.35),0 10px 26px -12px rgba(15,174,124,.55);filter:brightness(1.09);}
        .group-pill .gp-icon{width:12px;height:12px;margin-inline-start:.35rem;transition:.35s;}
        .group-pill.open .gp-icon{transform:rotate(180deg);}
        .group-menu{
          position:absolute;top:100%;${dir==="rtl"?"right:0;":"left:0;"}margin-top:.45rem;
          width:280px;padding:.55rem .6rem .7rem;
          background:#fffffffc;backdrop-filter:blur(12px);
          border:1px solid #10b98133;border-radius:.85rem;
          box-shadow:0 18px 38px -16px rgba(0,0,0,.28);
          animation:ddIn .18s ease;z-index:4000;
        }
        @keyframes ddIn{0%{opacity:0;transform:translateY(6px) scale(.97);}100%{opacity:1;transform:translateY(0) scale(1);}}
        .group-menu:before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#065f46,#10b981);}
        .group-menu a{display:block;font-size:.72rem;font-weight:500;padding:.48rem .55rem;border-radius:.6rem;color:#1f2937;text-decoration:none;transition:.18s;}
        .group-menu a:hover{background:#ecfdf5;color:#065f46;}
        .group-menu a.active{background:#10b981;color:#fff;font-weight:600;box-shadow:0 3px 10px -5px rgba(4,120,87,.45);}
        .nav-btn{
          height:var(--gp-height);padding:0 .9rem;border-radius:1rem;
          display:inline-flex;align-items:center;justify-content:center;
          font-size:calc(var(--gp-font) + .06rem);font-weight:600;
          color:#ffffffcc;text-decoration:none;white-space:nowrap;transition:.22s;
        }
        .nav-btn:hover{background:rgba(255,255,255,.15);color:#fff;}
        .nav-btn-active{background:#fff;color:#065f46!important;box-shadow:0 4px 14px -8px rgba(0,0,0,.25);}
        .admin-create-btn{
          height:var(--gp-height);padding:0 1.15rem;border-radius:1rem;
          font-size:calc(var(--gp-font) - .02rem);font-weight:700;letter-spacing:.08em;
          background:linear-gradient(120deg,#6366f1,#3b82f6 40%,#0ea5e9 70%,#10b981);
          background-size:170% 100%;color:#fff;border:1px solid rgba(255,255,255,.25);
          display:inline-flex;align-items:center;justify-content:center;transition:.55s;white-space:nowrap;
        }
        .admin-create-btn:hover{background-position:100% 0;filter:brightness(1.05);}
        .admin-create-btn.is-active{box-shadow:0 0 0 2px rgba(255,255,255,.4);}
        .lang-switch-wrapper{display:flex;align-items:center;justify-content:flex-end;min-width:120px;}
        .lang-switch{
          display:flex;align-items:center;gap:.35rem;
          background:rgba(255,255,255,.18);
          border:1px solid rgba(255,255,255,.35);
          padding:.3rem .4rem;
          border-radius:2rem;
          backdrop-filter:blur(6px);
        }
        .lang-switch button{
          font-size:calc(var(--gp-font) - .04rem);
          font-weight:700;
          letter-spacing:.07em;
          padding:.45rem .75rem;
          line-height:1;
          border-radius:999px;
          color:#fff;
          transition:.25s;
        }
        .lang-switch button.active{background:#fff;color:#065f46;box-shadow:0 0 0 1px #fff;}
        @media (max-width:1250px){
          .center-nav-wrapper{justify-content:flex-start;}
        }
        @media (max-width:1023px){
          .center-nav-wrapper{display:none;}
          .lang-switch-wrapper{display:none;}
        }
        @media (min-width:1024px){.mobile-area{display:none;}}
      `}</style>

      <div ref={fixedWrapRef} className="fixed top-0 inset-x-0 z-50" dir={dir}>
        <NavNewsTicker lang={lang} />
        <nav
          className={`w-full nav-root transition-colors duration-300 ${
            scrolled
              ? "bg-gradient-to-r from-green-800 via-green-700 to-green-800 shadow-lg"
              : "bg-gradient-to-r from-green-700 via-green-600 to-green-500"
          }`}
          data-compact={compact ? "true" : "false"}
        >
          <div className="mx-auto max-w-[1750px] nav-outer-padding">
            {/* Desktop bar layout: left brand / center titles / right language */}
            <div className="layout-bar py-1">
              {/* Left */}
              <Link to="/" className="brand-wrapper shrink-0 group pr-4 border-r border-white/15">
                <img src={logo} alt="Logo" className="transition-transform group-hover:scale-110" />
                <span className="brand-name">
                  {lang.startsWith("ar") ? "إقليم الحاجب" : "Province El Hajeb"}
                </span>
              </Link>

              {/* Center navigation */}
              <div className="center-nav-wrapper">
                <div ref={desktopNavRef} className="center-nav-inner">
                  {groups.map(g => {
                    const isOpen = openGroup === g.key;
                    const activeChild = g.items.some(i => location.pathname.startsWith(i.to));
                    const active = activeChild || location.pathname.startsWith(g.to);
                    return (
                      <div
                        key={g.key}
                        className="group-wrapper"
                        onMouseEnter={() => handleEnter(g.key)}
                        onMouseLeave={() => handleLeave(g.key)}
                      >
                        <button
                          type="button"
                          className={`group-pill ${active ? "active" : ""} ${isOpen ? "open" : ""}`}
                          onClick={() => setOpenGroup(isOpen ? null : g.key)}
                          aria-haspopup="true"
                          aria-expanded={isOpen}
                        >
                          <span className="gp-label">{g.label}</span>
                          <svg className="gp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {isOpen && (
                          <div className="group-menu" style={dir === "rtl" ? { right: 0 } : { left: 0 }}>
                            <ul>
                              {g.items.map(i => (
                                <li key={i.to}>
                                  <NavLink
                                    to={i.to}
                                    className={({ isActive }) => (isActive ? "active" : "")}
                                    onClick={() => setOpenGroup(null)}
                                  >
                                    {i.label}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {singles.map(s => (
                    <NavLink
                      key={s.to}
                      to={s.to}
                      className={({ isActive }) => `nav-btn ${isActive ? "nav-btn-active" : ""}`}
                    >
                      {s.label}
                    </NavLink>
                  ))}

                  {user?.is_admin && (
                    <NavLink
                      to="/users"
                      className={({ isActive }) => `admin-create-btn ${isActive ? "is-active" : ""}`}
                    >
                      {lang.startsWith("ar") ? "إنشاء مدير" : "Créer Admin"}
                    </NavLink>
                  )}

                  {user && (
                    <button
                      onClick={logout}
                      className="nav-btn bg-red-500 hover:bg-red-600 text-white"
                    >
                      {lang.startsWith("ar") ? "تسجيل الخروج" : t("logout")}
                    </button>
                  )}
                </div>
              </div>

              {/* Right language switch */}
              <div className="lang-switch-wrapper">
                <div className="lang-switch">
                  <button
                    className={lang === "fr" ? "active" : ""}
                    onClick={() => handleLangSwitch("fr")}
                  >
                    FR
                  </button>
                  <button
                    className={lang === "ar" ? "active" : ""}
                    onClick={() => handleLangSwitch("ar")}
                  >
                    AR
                  </button>
                </div>
              </div>

              {/* Mobile toggle (shown only <1024px) */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                className="mobile-area nav-btn h-10 w-10 bg-white/90 text-green-700 hover:bg-white shadow ml-auto"
                aria-label="Menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <svg className="w-5 h-5" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>

            {/* Mobile menu */}
            <div className={`mobile-area overflow-hidden transition-[max-height] duration-400 ${mobileOpen ? "max-h-[82vh] mb-3" : "max-h-0"}`}>
              {mobileOpen && (
                <div className="rounded-2xl p-4 grid gap-4 bg-white/95 backdrop-blur shadow border border-green-100">
                  {groups.map(g => {
                    const open = openGroup === g.key;
                    return (
                      <div key={g.key} className="rounded-2xl border border-green-200 overflow-hidden">
                        <button
                          onClick={() => setOpenGroup(open ? null : g.key)}
                          className={`w-full text-left px-4 py-3 text-[11px] font-bold uppercase tracking-wide ${
                            open ? "bg-green-600 text-white" : "text-green-800 bg-green-50"
                          }`}
                        >
                          {g.label}
                        </button>
                        <div className={`grid transition-all ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                          <ul className="overflow-hidden flex flex-col gap-1 pb-3 pt-2 px-3">
                            {g.items.map(i => (
                              <li key={i.to}>
                                <NavLink
                                  to={i.to}
                                  onClick={() => { setMobileOpen(false); setOpenGroup(null); }}
                                  className={({ isActive }) =>
                                    `flex items-center gap-2 rounded-xl px-3 py-2 text-xs ${
                                      isActive ? "bg-green-600 text-white" : "text-green-700 hover:bg-green-100"
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
                    {singles.map(s => (
                      <NavLink
                        key={s.to}
                        to={s.to}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `flex-1 min-w-[120px] text-center px-3 py-3 rounded-2xl text-sm font-semibold ${
                            isActive
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
                          `flex-1 min-w-[120px] text-center px-3 py-3 rounded-2xl text-sm font-semibold admin-create-btn ${
                            isActive ? "is-active" : ""
                          }`
                        }
                      >
                        {lang.startsWith("ar") ? "إنشاء مدير" : "Créer Admin"}
                      </NavLink>
                    )}
                    {user && (
                      <button
                        onClick={() => { logout(); setMobileOpen(false); }}
                        className="flex-1 min-w-[120px] px-3 py-3 rounded-2xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white"
                      >
                        {lang.startsWith("ar") ? "تسجيل الخروج" : t("logout")}
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-1">
                    <button
                      onClick={() => handleLangSwitch("fr")}
                      className={`px-4 py-1 rounded-full text-sm font-bold ${
                        lang === "fr" ? "bg-green-600 text-white shadow" : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      FR
                    </button>
                    <button
                      onClick={() => handleLangSwitch("ar")}
                      className={`px-4 py-1 rounded-full text-sm font-bold ${
                        lang === "ar" ? "bg-green-600 text-white shadow" : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      AR
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
      <div style={{ height: spacerH }} />
    </>
  );
}
