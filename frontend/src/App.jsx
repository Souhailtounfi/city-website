import { BrowserRouter, Routes, Route } from "react-router-dom";
import NewsList from "./pages/NewsList";
import NewsForm from "./pages/NewsForm";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import NewsDetail from "./pages/NewsDetail";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/new" element={<NewsForm />} />
        <Route path="/news/:id/edit" element={<NewsForm />} />
        <Route path="/news/:id" element={<NewsDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
