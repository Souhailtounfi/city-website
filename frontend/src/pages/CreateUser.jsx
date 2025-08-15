import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CreateUser() {
  const { t } = useTranslation();
  const [fields, setFields] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFields({ ...fields, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/users", { ...fields, is_admin: true });
      navigate("/news");
    } catch {
      setError(t("error_create_admin") || "Error creating admin");
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        {t("add_admin") || "Add Admin"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2"
          name="name"
          value={fields.name}
          onChange={handleChange}
          placeholder={t("name") || "Name"}
          required
        />
        <input
          className="w-full border p-2"
          name="email"
          value={fields.email}
          onChange={handleChange}
          placeholder={t("email")}
          required
        />
        <input
          className="w-full border p-2"
          name="password"
          type="password"
          value={fields.password}
          onChange={handleChange}
          placeholder={t("password")}
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          type="submit"
        >
          {t("create") || "Create"}
        </button>
      </form>
    </div>
  );
}
