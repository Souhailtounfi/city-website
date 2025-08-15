import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function NewsDetail() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api.get(`/news/${id}`).then(res => setNews(res.data));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(lang === "ar" ? "هل تريد حذف هذا الخبر؟" : "Delete this news?")) {
      await api.delete(`/news/${id}`);
      navigate("/news");
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm(lang === "ar" ? "حذف هذه الصورة ؟" : "Supprimer cette image ?")) return;
    try {
      await api.delete(`/news-images/${imageId}`);
      setNews(n => ({
        ...n,
        images: (n.images || []).filter(im => im.id !== imageId)
      }));
    } catch (e) {
      console.error(e);
      alert(lang === "ar" ? "فشل الحذف" : "Suppression échouée");
    }
  };

  if (!news) return <div className="p-8">{lang === "ar" ? "جاري التحميل..." : "Chargement..."}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        {news.image && (
          <img
            src={`http://localhost:8000/storage/${news.image}`}
            alt={lang === "ar" ? news.title_ar : news.title_fr}
            className="w-full h-96 object-cover rounded mb-4"
          />
        )}
        <h1 className="text-2xl font-bold mb-2" dir={lang === "ar" ? "rtl" : "ltr"}>
          {lang === "ar" ? news.title_ar : news.title_fr}
        </h1>
        <div className="text-gray-500 mb-4" dir={lang === "ar" ? "rtl" : "ltr"}>
          {news.created_at
            ? new Date(news.created_at).toLocaleDateString(lang === "ar" ? "ar-MA" : "fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""}
        </div>
        <div className="mb-6 text-lg" dir={lang === "ar" ? "rtl" : "ltr"}>
          {lang === "ar" ? news.content_ar : news.content_fr}
        </div>
        {/* Extra images gallery */}
        {news.images && news.images.length > 0 && (
          <div className="mt-10">
            <h2 className="font-semibold mb-4 text-xl" dir={lang === "ar" ? "rtl" : "ltr"}>
              {lang === "ar" ? "معرض الصور" : "Galerie de photos"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.images.map(img => {
                const src = `http://localhost:8000/storage/${img.image}`;
                return (
                  <div
                    key={img.id}
                    className="group relative rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                  >
                    <button
                      type="button"
                      onClick={() => setLightbox(src)}
                      className="block w-full"
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition" />
                    </button>

                    {user?.is_admin && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(img.id);
                        }}
                        title={lang === "ar" ? "حذف" : "Supprimer"}
                        className="absolute top-2 right-2 bg-red-600/90 hover:bg-red-700 text-white p-2 rounded-full shadow focus:outline-none focus:ring focus:ring-red-300 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="w-5 h-5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M9 6V4h6v2m1 0v14a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6h10Z" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Update & Delete buttons */}
        <div className="flex flex-col gap-4 mt-8">
          {user?.is_admin && (
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/news/${news.id}/edit`}
                className="px-4 py-2 rounded-md font-semibold bg-amber-400 hover:bg-amber-500 text-white shadow-sm transition"
              >
                {t('edit')}
              </Link>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-md font-semibold bg-red-500 hover:bg-red-600 text-white shadow-sm transition"
              >
                {t('delete')}
              </button>
            </div>
          )}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 bg-red-600 text-white w-10 h-10 rounded-full text-lg font-bold shadow hover:bg-red-700"
            >
              ×
            </button>
            <img
              src={lightbox}
              alt="preview"
              className="w-full max-h-[80vh] object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}