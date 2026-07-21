import React, { lazy, Suspense, useEffect, useRef } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { CyberCircuit } from "./components/CyberCircuit";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Header } from "./components/Header";
import { useSmoothScroll } from "./hooks/useSmoothScroll";

const HomePage = lazy(() => import("./pages/HomePage").then(({ HomePage: page }) => ({ default: page })));
const ProgramPage = lazy(() =>
  import("./pages/ProgramPage").then(({ ProgramPage: page }) => ({ default: page })),
);
const SpecialtyQuiz = lazy(() =>
  import("./pages/SpecialtyQuiz").then(({ SpecialtyQuiz: page }) => ({ default: page })),
);

function ScrollProgress() {
  const progressRef = useRef(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      progressRef.current?.style.setProperty("transform", `scaleX(${progress})`);
    };

    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={progressRef} className="progress" aria-hidden="true" />;
}

export default function App() {
  useSmoothScroll();

  return (
    <div className="app">
      <ScrollProgress />
      <CyberCircuit />
      <Header />
      <ErrorBoundary>
        <Suspense fallback={<div className="route-loading" role="status">Загрузка…</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<SpecialtyQuiz />} />
            <Route path="/program/:id" element={<ProgramPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
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
