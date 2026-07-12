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

export default function App() {
  return (
    <LanguageProvider>
      <Preloader />
      <div className="grain-overlay" />
      <CursorGlow />
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
