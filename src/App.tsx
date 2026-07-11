import { useSmoothScroll } from "./hooks/useSmoothScroll";
import CursorGlow from "./components/CursorGlow";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  useSmoothScroll();

  return (
    <div className="grain relative min-h-screen bg-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-bone focus:px-5 focus:py-3 focus:text-ink"
      >
        Skip to content
      </a>
      <CursorGlow />
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
