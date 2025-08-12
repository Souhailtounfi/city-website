import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function NewsDetail({ lang }) {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/news/${id}`).then(res => setNews(res.data));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm(lang === "ar" ? "هل تريد حذف هذا الخبر؟" : "Delete this news?")) {
      await api.delete(`/news/${id}`);
      navigate("/news");
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
          <div>
            <h2 className="font-semibold mb-2" dir={lang === "ar" ? "rtl" : "ltr"}>
              {lang === "ar" ? "معرض الصور" : "Galerie de photos"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {news.images.map(img => (
                <img
                  key={img.id}
                  src={`http://localhost:8000/storage/${img.image}`}
                  alt=""
                  className="w-full h-40 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}
        {/* Update & Delete buttons */}
        <div className="flex gap-4 mt-8">
          <Link
            to={`/news/${news.id}/edit`}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {lang === "ar" ? "تعديل" : "Modifier"}
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            {lang === "ar" ? "حذف" : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}