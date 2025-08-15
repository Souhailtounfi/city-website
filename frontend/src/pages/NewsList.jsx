import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function NewsList() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { user } = useAuth();
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
    <div className="bg-gray-50 min-h-screen py-6 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{t("headline")}</h1>

        {/* Search & Add Button */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <input
            type="text"
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-4 py-2 w-full max-w-md"
            dir={lang === "ar" ? "rtl" : "ltr"}
          />
          {user?.is_admin && (
            <Link
              to="/news/new"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {t("add_announcement")}
            </Link>
          )}
        </div>

        {/* News List */}
        <div className="flex flex-col gap-6">
          {filtered.length === 0 ? (
            <div className="text-center text-gray-500">{t("no_results")}</div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col md:flex-row"
              >
                {/* Image */}
                {item.image && (
                  <div className="md:w-1/3">
                    <img
                      src={`http://localhost:8000/storage/${item.image}`}
                      alt={lang === "ar" ? item.title_ar : item.title_fr}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <span className="inline-block bg-orange-400 text-white text-xs px-2 py-1 rounded mb-2 font-semibold">
                    {t("announcement")}
                  </span>
                  <h2
                    className="font-bold text-lg mb-2"
                    dir={lang === "ar" ? "rtl" : "ltr"}
                  >
                    {lang === "ar" ? item.title_ar : item.title_fr}
                  </h2>
                  <p
                    className="text-gray-700 text-sm mb-4 flex-1"
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
                    {user?.is_admin && (
                      <div className="flex gap-2">
                        <Link
                          to={`/news/${item.id}/edit`}
                          className="px-3 py-1.5 rounded-md text-sm font-semibold bg-amber-400 hover:bg-amber-500 text-white shadow-sm hover:shadow transition"
                        >
                          {t("edit")}
                        </Link>
                        <button
                          onClick={() =>
                            window.confirm(t("confirm_delete")) &&
                            api.delete(`/news/${item.id}`).then(() =>
                              setNews(news.filter((n) => n.id !== item.id))
                            )
                          }
                          className="px-3 py-1.5 rounded-md text-sm font-semibold bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow transition"
                        >
                          {t("delete")}
                        </button>
                      </div>
                    )}
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
    </div>
  );
}
