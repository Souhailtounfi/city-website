import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function NewsForm() {
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
      await api.post(`/news/${id}?_method=PUT`, formData); // Laravel expects PUT
    } else {
      await api.post("/news", formData);
    }
    navigate("/news");
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">{id ? "Edit News" : "Add News"}</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
        <input className="w-full border p-2" name="title_fr" value={fields.title_fr} onChange={handleChange} placeholder="Title (FR)" required />
        <input className="w-full border p-2" name="title_ar" value={fields.title_ar} onChange={handleChange} placeholder="Title (AR)" required />
        <textarea className="w-full border p-2" name="content_fr" value={fields.content_fr} onChange={handleChange} placeholder="Content (FR)" required />
        <textarea className="w-full border p-2" name="content_ar" value={fields.content_ar} onChange={handleChange} placeholder="Content (AR)" required />
        <input type="file" name="image" accept="image/*" onChange={handleChange} />
        <input type="file" name="extra_images" accept="image/*" multiple onChange={handleChange} />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" type="submit">{id ? "Update" : "Create"}</button>
      </form>
    </div>
  );
}
