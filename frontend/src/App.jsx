import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NewsList from "./pages/NewsList";
import NewsForm from "./pages/NewsForm";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import NewsDetail from "./pages/NewsDetail";
import Footer from "./components/Footer";
import CreateUser from "./pages/CreateUser";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [lang, setLang] = useState("fr");

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar lang={lang} setLang={setLang} />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/news" element={<NewsList lang={lang} />} />
          <Route path="/news/:id" element={<NewsDetail lang={lang} />} />
          <Route path="/users" element={<CreateUser />} />

          {/* Admin Routes */}
          <Route
            path="/news/new"
            element={
              <ProtectedRoute adminOnly>
                <NewsForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news/:id/edit"
            element={
              <ProtectedRoute adminOnly>
                <NewsForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news/:id/images"
            element={
              <ProtectedRoute adminOnly>
                <NewsForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news-images/:id"
            element={
              <ProtectedRoute adminOnly>
                <NewsForm />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/news" replace />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
