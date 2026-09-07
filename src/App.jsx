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
import StudyUK from "./pages/StudyUK";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Stories from "./pages/Stories";
import StoryDetail from "./pages/StoryDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import BranchDetail from "./pages/BranchDetail";
import Pillar from "./pages/Pillar";
import Apply from "./pages/Apply";
import Legal from "./pages/Legal";
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
          <Route path="/study-in-uk" element={<StudyUK />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetail />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:category" element={<Stories />} />
          <Route path="/story/:slug" element={<StoryDetail />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/mission" element={<Pillar />} />
          <Route path="/vision" element={<Pillar />} />
          <Route path="/values" element={<Pillar />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/branch/:slug" element={<BranchDetail />} />
          <Route path="/apply-now" element={<Apply />} />
          <Route path="/privacy-policy" element={<Legal />} />
          <Route path="/terms-and-conditions" element={<Legal />} />
          <Route path="/cookie-policy" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
