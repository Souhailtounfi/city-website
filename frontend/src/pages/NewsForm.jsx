import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { useTranslation } from "react-i18next";

export default function NewsForm() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { id } = useParams();
  const navigate = useNavigate();
  const [fields, setFields] = useState({
    title_fr: "",
    title_ar: "",
    content_fr: "",
    content_ar: "",
    image: null,
    extra_images: []
  });

  useEffect(() => {
    if (id) {
      api.get(`/news/${id}`).then(res => {
        setFields(f => ({
          ...f,
          ...res.data,
          image: null,
          extra_images: []
        }));
      });
    }
  }, [id]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFields(f => ({ ...f, image: files[0] }));
    } else if (name === "extra_images") {
      setFields(f => ({ ...f, extra_images: files }));
    } else {
      setFields(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(fields).forEach(([key, val]) => {
      if (key === "extra_images" && val.length) {
        for (let file of val) formData.append("extra_images[]", file);
      } else if (val) {
        formData.append(key, val);
      }
    });

    if (id) {
      await api.post(`/news/${id}?_method=PUT`, formData);
    } else {
      await api.post("/news", formData);
    }
    navigate("/news");
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        {id ? t("edit_news") : t("add_news")}
      </h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <input
          className="w-full border p-2"
          name="title_fr"
          value={fields.title_fr}
          onChange={handleChange}
          placeholder={t("title_fr")}
          required
        />
        <input
          className="w-full border p-2"
          name="title_ar"
          value={fields.title_ar}
          onChange={handleChange}
          placeholder={t("title_ar")}
          required
          dir="rtl"
        />
        <textarea
          className="w-full border p-2"
          name="content_fr"
          value={fields.content_fr}
          onChange={handleChange}
          placeholder={t("content_fr")}
          required
        />
        <textarea
          className="w-full border p-2"
          name="content_ar"
          value={fields.content_ar}
          onChange={handleChange}
          placeholder={t("content_ar")}
          required
          dir="rtl"
        />
        {/* Main image upload */}
        <label className="block">
          <span className="block mb-1 font-medium">{t("Choose the main image (Optional)")}</span>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
          />
        </label>
        {/* Extra images upload */}
        <label className="block">
          <span className="block mb-1 font-medium">{t("Choose the other images (Optional)")}</span>
          <input
            type="file"
            name="extra_images"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-green-50 file:text-green-700
              hover:file:bg-green-100"
          />
        </label>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          type="submit"
        >
          {id ? t("edit") : t("create")}
        </button>
      </form>
    </div>
  );
}
