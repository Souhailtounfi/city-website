import React, { useEffect, useState } from "react";
import { fetchPage } from "../services/pages";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import PageEditor from "../components/PageEditor";
import PageSidebar from "../components/PageSidebar";

const SLUG = "apercu-historique";

export default function ApercuHistorique() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const { user } = useAuth();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let act = true;
    (async () => {
      try {
        setLoading(true); setErr("");
        const p = await fetchPage(SLUG);
        if (act) setPage(p);
      } catch (e) {
        if (act) setErr(e?.response?.status === 404 ? "nf" : "load");
      } finally {
        if (act) setLoading(false);
      }
    })();
    return () => { act = false; };
  }, []);

  const title = page
    ? (lang === "ar" ? page.title_ar || page.title_fr : page.title_fr)
    : (lang === "ar" ? "لمحة تاريخية" : "Aperçu Historique");
  const content = page
    ? (lang === "ar" ? page.content_ar || page.content_fr : page.content_fr)
    : "";

  return (
    <div dir={dir} className="pg-shell">
      <Style />
      <div className="pg-container">
        <Header title={loading ? "..." : title} />
        {user?.is_admin && (
          <div className="mb-12">
            <PageEditor slug={SLUG} page={page} onSaved={setPage} />
            {err === "nf" && (
              <p className="hint-warn">
                {lang === "ar"
                  ? "الصفحة غير موجودة وتم تجهيز نموذج الإنشاء."
                  : "La page n’existait pas, formulaire de création prêt."}
              </p>
            )}
          </div>
        )}

        <div className="xl:grid xl:grid-cols-[1fr_340px] xl:gap-12">
          <div>
            {loading && <Skeleton lines={10} />}
            {!loading && err === "load" && (
              <Callout type="error" text={lang==="ar"?"خطأ في التحميل":"Erreur de chargement"} />
            )}
            {!loading && err === "nf" && !user && (
              <Callout type="pending" text={lang==="ar"?"متاحة قريباً":"Disponible prochainement"} />
            )}
            {!loading && !err && page && (
              <article
                id="description"
                className="pg-article mb-10"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            )}
          </div>
          <PageSidebar lang={lang} slug={SLUG} theme="light" />
        </div>
      </div>
    </div>
  );
}

function Header({ title }) {
  return (
    <div className="pg-header">
      <h1>{title}</h1>
      <div className="pg-sep" />
    </div>
  );
}

function Skeleton({ lines = 8 }) {
  return (
    <div className="space-y-4 animate-pulse mb-10">
      <div className="h-7 w-1/2 bg-green-100 rounded" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 w-full bg-green-50 rounded" />
      ))}
    </div>
  );
}

function Callout({ type, text }) {
  const base = "px-6 py-5 rounded-2xl text-sm font-medium border";
  const styles =
    type === "error"
      ? "bg-red-50 border-red-200 text-red-700"
      : type === "pending"
      ? "bg-green-50 border-green-200 text-green-700"
      : "bg-gray-50 border-gray-200 text-gray-600";
  return <div className={`${base} ${styles}`}>{text}</div>;
}

function Style() {
  return (
    <style>{`
      .pg-shell{
        min-height:100vh;
        background:
          radial-gradient(circle at 12% 25%,#ecfdf5,transparent 70%),
          radial-gradient(circle at 88% 70%,#d1fae5,transparent 60%),
          linear-gradient(120deg,#ffffff,#f0fdf4);
        padding:3rem 1rem 4rem;
      }
      .pg-container{ max-width:1020px; margin:0 auto; }
      .pg-header h1{
        font-size:clamp(2.1rem,4vw,3rem);
        font-weight:800;
        line-height:1.1;
        letter-spacing:.5px;
        background:linear-gradient(90deg,#065f46,#047857,#10b981);
        -webkit-background-clip:text;
        color:transparent;
      }
      .pg-sep{
        margin-top:1rem;
        height:3px;
        width:100%;
        background:linear-gradient(90deg,transparent,#34d399,transparent);
        border-radius:999px;
      }
      .pg-article{
        font-size:1.05rem;
        line-height:1.85;
        font-weight:500;
        color:#1f2937;
      }
      .pg-article p{ margin-bottom:1.15em; }
      .pg-article strong{ color:#065f46; }
      .hint-warn{
        margin-top:.75rem;
        font-size:11px;
        font-weight:600;
        color:#b45309;
      }
    `}</style>
  );
}