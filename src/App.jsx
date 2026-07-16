import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CyberCircuit } from "./components/CyberCircuit";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Header } from "./components/Header";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { HomePage } from "./pages/HomePage";
import { ProgramPage } from "./pages/ProgramPage";
import { SpecialtyQuiz } from "./pages/SpecialtyQuiz";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useSmoothScroll();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  return (
    <div className="app">
      <motion.div className="progress" style={{ scaleX }} />
      <CyberCircuit />
      <Header />
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<SpecialtyQuiz />} />
            <Route path="/program/:id" element={<ProgramPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </AnimatePresence>
      </ErrorBoundary>
      <footer className="footer">
        <span>Т-университет · Институт сквозных технологий ДГТУ</span>
        <Link className="footer-link" to="/quiz">
          К тесту
        </Link>
      </footer>
    </div>
  );
}
