import { useEffect, useState } from "react";
import { LanguageProvider } from "./i18n/LanguageContext";
import Preloader from "./components/Preloader";
import CursorGlow from "./components/CursorGlow";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Process from "./components/Process";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import ScrollProgress from "./components/ScrollProgress";
import AdminPage from "./admin/AdminPage";

/** Hash routes that open the private admin panel (site.com/#/admin). */
const ADMIN_HASHES = ["#/admin", "#/panel"];

function currentHash() {
  if (typeof window === "undefined") return "";
  return window.location.hash.split("?")[0].toLowerCase();
}

function useIsAdminRoute() {
  const [isAdmin, setIsAdmin] = useState(() => ADMIN_HASHES.includes(currentHash()));

  useEffect(() => {
    const onChange = () => setIsAdmin(ADMIN_HASHES.includes(currentHash()));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return isAdmin;
}

export default function App() {
  const isAdmin = useIsAdminRoute();

  if (isAdmin) return <AdminPage />;

  return (
    <LanguageProvider>
      <Preloader />
      <div className="grain-overlay" />
      <CursorGlow />
      <ScrollProgress />
      <div className="relative min-h-screen bg-noir text-beige-light">
        <Navbar />
        <main>
          <Hero />
          <About />
          <Services />
          <Portfolio />
          <Process />
          <Contact />
        </main>
        <Footer />
        <FloatingActions />
      </div>
    </LanguageProvider>
  );
}
