import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function NewsList({ lang }) {
  const [news, setNews] = useState([]);

  useEffect(() => {
    api.get("/news").then((res) => setNews(res.data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {lang === "ar" ? "الأخبار" : "A LA UNE"}
      </h1>
      <div className="mb-6 flex justify-end">
        <Link
          to="/news/new"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {lang === "ar" ? "إضافة خبر" : "Ajouter une annonce"}
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {news.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
          >
            {item.image && (
              <img
                src={`http://localhost:8000/storage/${item.image}`}
                alt={lang === "ar" ? item.title_ar : item.title_fr}
                className="h-48 w-full object-cover"
              />
            )}
            <div className="p-4 flex-1 flex flex-col">
              <span className="inline-block bg-orange-400 text-white text-xs px-2 py-1 rounded mb-2 font-semibold">
                {lang === "ar" ? "إعلان" : "Annonce"}
              </span>
              <h2 className="font-bold text-lg mb-2 line-clamp-2">
                {lang === "ar" ? item.title_ar : item.title_fr}
              </h2>
              <p
                className="text-gray-700 text-sm mb-4 flex-1 line-clamp-3"
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                {lang === "ar" ? item.content_ar : item.content_fr}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <Link
                  to={`/news/${item.id}`}
                  className="text-green-600 font-semibold hover:underline"
                >
                  {lang === "ar" ? "اقرأ المزيد →" : "SAVOIR PLUS →"}
                </Link>
                <button
                  onClick={() =>
                    window.confirm("Delete this news?") &&
                    api
                      .delete(`/news/${item.id}`)
                      .then(() => setNews(news.filter((n) => n.id !== item.id)))
                  }
                  className="text-red-500 text-sm ml-2"
                >
                  {lang === "ar" ? "حذف" : "Supprimer"}
                </button>
              </div>
              <div
                className="text-gray-400 text-xs mt-2"
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                {item.created_at
                  ? new Date(item.created_at).toLocaleDateString(
                      lang === "ar" ? "ar-MA" : "fr-FR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )
                  : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
