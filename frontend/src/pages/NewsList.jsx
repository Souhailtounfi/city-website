import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NewsList() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    api.get("/news").then((res) => {
      setNews(res.data);
      setFiltered(res.data);
    });
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    setFiltered(
      news.filter(
        (item) =>
          (item.title_fr && item.title_fr.toLowerCase().includes(term)) ||
          (item.title_ar && item.title_ar.toLowerCase().includes(term))
      )
    );
  }, [search, news]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{t("headline")}</h1>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder={t("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full max-w-md"
          dir={lang === "ar" ? "rtl" : "ltr"}
        />
        <Link
          to="/news/new"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {t("add_announcement")}
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            {t("no_results")}
          </div>
        ) : (
          filtered.map((item) => (
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
                  {t("announcement")}
                </span>
                <h2
                  className="font-bold text-lg mb-2 line-clamp-2"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                >
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
                    {t("read_more")}
                  </Link>
                  <button
                    onClick={() =>
                      window.confirm(t("confirm_delete")) &&
                      api.delete(`/news/${item.id}`).then(() =>
                        setNews(news.filter((n) => n.id !== item.id))
                      )
                    }
                    className="text-white text-sm ml-2 bg-red-500 hover:bg-red-600 px-2 py-1 rounded"
                  >
                    {t("delete")}
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
          ))
        )}
      </div>
    </div>
  );
}
