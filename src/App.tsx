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
import AdminMessages from "./pages/AdminMessages";

const ADMIN_ROUTE = "/admin/messages";

function normalizePath(pathname: string): string {
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/** Minimal pathname tracking — the site only has the landing page + admin. */
function useCurrentPath(): string {
  const [path, setPath] = useState(() =>
    typeof window === "undefined" ? "/" : normalizePath(window.location.pathname)
  );

  useEffect(() => {
    const onPopState = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return path;
}

export default function App() {
  const path = useCurrentPath();
  const isAdmin = path === ADMIN_ROUTE || path.startsWith(`${ADMIN_ROUTE}/`);

  return (
    <LanguageProvider>
      {isAdmin ? (
        <AdminMessages />
      ) : (
        <>
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
        </>
      )}
    </LanguageProvider>
  );
}
