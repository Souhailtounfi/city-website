import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/news");
    } catch (err) {
      setError(
        err?.response?.data?.message === "Invalid credentials"
          ? t("invalid_credentials") || "Identifiants invalides"
          : t("login_error") || "Erreur de connexion"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">{t("login")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("email")}
          required
        />
        <input
          className="w-full border p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("password")}
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        <button
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? t("loading") : t("login")}
        </button>
      </form>
    </div>
  );
}
