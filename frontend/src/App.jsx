import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewsList from "./pages/NewsList";
import NewsForm from "./pages/NewsForm";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import NewsDetail from "./pages/NewsDetail";
import Footer from "./components/Footer";

function App() {
  const [lang, setLang] = useState("fr");

  return (
    <BrowserRouter>
      <Navbar lang={lang} setLang={setLang} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/news" element={<NewsList lang={lang} />} />
        <Route path="/news/new" element={<NewsForm />} />
        <Route path="/news/:id/edit" element={<NewsForm />} />
        <Route path="/news/:id" element={<NewsDetail lang={lang} />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
