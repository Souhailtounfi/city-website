import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function NewsList() {
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
    setFiltered(
      news.filter((item) =>
        item.title_fr.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, news]);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this news?")) {
      await api.delete(`/news/${id}`);
      setNews(news.filter((n) => n.id !== id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">A LA UNE</h1>
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Rechercher par titre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full max-w-md"
        />
        <Link
          to="/news/new"
          className="ml-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Ajouter une annonce
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
          >
            {item.image && (
              <img
                src={`http://localhost:8000/storage/${item.image}`}
                alt={item.title_fr}
                className="h-48 w-full object-cover"
              />
            )}
            <div className="p-4 flex-1 flex flex-col">
              <span className="inline-block bg-orange-400 text-white text-xs px-2 py-1 rounded mb-2 font-semibold">
                Annonce
              </span>
              <h2 className="font-bold text-lg mb-2 line-clamp-2">
                {item.title_fr}
              </h2>
              <p className="text-gray-700 text-sm mb-4 flex-1 line-clamp-3">
                {item.content_fr}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <Link
                  to={`/news/${item.id}`}
                  className="text-green-600 font-semibold hover:underline"
                >
                  SAVOIR PLUS →
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 text-sm ml-2"
                >
                  Supprimer
                </button>
              </div>
              <div className="text-gray-400 text-xs mt-2">
                {item.created_at
                  ? new Date(item.created_at).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : ""}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
