import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

import Home from "./pages/Home";
import Countries from "./pages/Countries";
import Study from "./pages/Study";
import University from "./pages/University";
import Courses from "./pages/Courses";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Apply from "./pages/Apply";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/study" element={<Study />} />
          <Route path="/study/:country" element={<Study />} />
          <Route path="/study/:country/:program/:course" element={<Study />} />
          <Route path="/university/:slug" element={<University />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/apply-now" element={<Apply />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
