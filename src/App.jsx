import React, { useEffect, useMemo, useState } from "react";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  ArrowLeft,
  ArrowRight,
  BrainCircuit,
  Building2,
  Cpu,
  Gamepad2,
  Globe2,
  Network,
  Orbit,
  Plane,
  Sparkles,
  Moon,
  Sun,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const programs = [
  {
    id: "construction",
    code: "08.03.01",
    field: "Строительство",
    title: "Цифровое гражданское строительство",
    icon: Building2,
    tag: "BIM + IT",
    room: "МФЦ 105",
    tone: "mint",
    concept:
      "Подготовка специалистов строительной отрасли, ориентированных на цифровые технологии, BIM-моделирование, расчет и конструирование строительных объектов.",
    goal:
      "Выпускники работают на стыке строительства и IT: управляют жизненным циклом объекта, автоматизируют строительный контроль и анализируют данные.",
    disciplines: [
      "Цифровые технологии в строительстве",
      "Планировка, застройка и реконструкция зданий",
      "Управленческая экспертиза",
      "Системная интеграция в проектировании и строительстве",
      "GIS и большие данные",
      "Методы анализа рынка недвижимости",
    ],
  },
  {
    id: "ai",
    code: "09.03.02",
    field: "Информационные системы и технологии",
    title: "Машинное обучение и искусственный интеллект",
    icon: BrainCircuit,
    tag: "AI",
    room: "МФЦ 149, №2",
    tone: "violet",
    concept:
      "Программа формирует практические навыки разработки и внедрения моделей искусственного интеллекта в бизнес-процессы и прикладные системы.",
    goal:
      "Студенты изучают компьютерное зрение, обработку звука, анализ временных рядов, нейронные сети, фреймворки глубокого обучения и основы DevOps.",
    disciplines: [
      "Введение в DevOps",
      "Основы анализа данных",
      "Глубокое обучение",
      "Разработка интерфейсов",
      "Разработка серверных приложений",
    ],
  },
  {
    id: "games",
    code: "09.03.03",
    field: "Прикладная информатика",
    title: "Разработка игр и прикладных программ",
    icon: Gamepad2,
    tag: "GameDev",
    room: "Проектные лаборатории",
    tone: "teal",
    concept:
      "Подготовка разработчиков, способных работать на стыке программирования, игровых механик, 3D-графики и геймдизайна.",
    goal:
      "Обучение проходит через игровые движки, прототипирование, объектно-ориентированное программирование, визуализацию, анимацию и аналитику проектов.",
    disciplines: [
      "Программирование игр на Unity",
      "Проектирование классов в разработке игр",
      "Геймдизайн",
      "Программирование мобильных игр",
    ],
  },
  {
    id: "web-design",
    code: "09.03.03",
    field: "Прикладная информатика",
    title: "Веб-разработка и дизайн",
    icon: Sparkles,
    tag: "Web + 3D",
    room: "Motion-студия",
    tone: "lavender",
    concept:
      "Подготовка специалистов в дизайне, 3D-графике, анимации, дополненной и виртуальной реальности с современным цифровым мышлением.",
    goal:
      "Выпускники создают визуальные решения полного цикла: от концепции до финальной реализации цифровых продуктов, сайтов и сервисов.",
    disciplines: [
      "Нейросети в разработке web-приложений",
      "Нейросети для 3D-моделинга",
      "Интеграция 3D в Web",
      "Разработка Web-приложения",
      "Адаптивный и мобильный дизайн",
    ],
  },
  {
    id: "media",
    code: "11.03.02",
    field: "Инфокоммуникационные технологии и системы связи",
    title: "Медиатехнологии и инфокоммуникации",
    icon: Network,
    tag: "MediaTech",
    room: "МФЦ 149, №2",
    tone: "mint",
    concept:
      "Подготовка специалистов для цифровых медиа, инфокоммуникаций, телеком-операторов, IT-компаний, агентств и цифровых производств.",
    goal:
      "Студенты работают с медиаконтентом, цифровыми системами доставки, сетями связи, веб-технологиями и моделированием сложных систем.",
    disciplines: [
      "Базы данных",
      "Frontend разработка",
      "Брендинг инфокоммуникационной отрасли",
      "Управление медиапроектами",
      "Цифровой маркетинг и SMM",
    ],
  },
  {
    id: "robotics",
    code: "23.05.01",
    field: "Наземные транспортно-технологические средства",
    title: "Беспилотные системы и технологии",
    icon: Cpu,
    tag: "Robotics",
    room: "МФЦ 149, №3",
    tone: "violet",
    concept:
      "Инженерная подготовка в области беспилотных систем, технического зрения, микроконтроллеров, ИИ и 3D-моделирования мехатронных устройств.",
    goal:
      "Выпускники проектируют, внедряют и эксплуатируют робототехнические и беспилотные комплексы для транспорта, логистики и агросектора.",
    disciplines: [
      "Системы компьютерного зрения",
      "Патентоведение",
      "ИИ в мехатронике и робототехнике",
      "Математическое моделирование",
      "Системы технического зрения",
    ],
  },
  {
    id: "aviation",
    code: "24.03.04",
    field: "Авиастроение",
    title: "Беспилотные авиационные системы",
    icon: Plane,
    tag: "UAV",
    room: "МФЦ 143, №4",
    tone: "teal",
    concept:
      "Подготовка специалистов по эксплуатации беспилотных авиационных систем, проектированию и конструированию узлов авиационной техники.",
    goal:
      "Программа охватывает аэродинамику, планер, системы управления, навигационное ПО, CAD, схемотехнику и микропроцессорную технику.",
    disciplines: [
      "Дизайн конструкций БПЛА",
      "Конструирование механизмов БПЛА",
      "Моделирование в современных САПР",
      "Конструкторская документация БПЛА",
    ],
  },
  {
    id: "business",
    code: "38.03.01",
    field: "Экономика",
    title: "Международный бизнес",
    icon: Globe2,
    tag: "Global",
    room: "МФЦ 140, №5",
    tone: "lavender",
    concept:
      "Подготовка специалистов мировой экономики и управления международным бизнесом с аналитическим мышлением и двумя иностранными языками.",
    goal:
      "Студенты проходят проектные модули, изучают английский и второй иностранный язык, участвуют в исследованиях, стажировках и академической мобильности.",
    disciplines: [
      "Инвестиционный менеджмент",
      "Бизнес-планирование",
      "Международное право",
      "Международные экономические отношения",
      "Макроэкономика",
      "Экономика труда",
    ],
  },
];

const tasks = [
  "Флагманские образовательные программы",
  "Индивидуальные траектории обучения",
  "Компетенции цифровой экономики",
  "Научно-исследовательская деятельность",
  "Индустриальные и научные партнеры",
  "Качество образовательных программ",
];

const instituteBenefits = [
  "Востребованное образование на национальном и международном рынках",
  "Интеграция в глобальное научно-исследовательское и профессиональное сообщество",
  "Практика и трудоустройство в крупнейших российских и международных компаниях",
  "Авторские курсы, модульная система обучения и мастер-классы от экспертов мирового уровня",
  "Индивидуальная образовательная траектория и личная стратегия профессионального развития",
  "Развитие навыков будущего: междисциплинарных компетенций, hard, soft и self-skills",
];

const specializationGraph = [
  {
    title: "Область специализации 1",
    detail: "смежная база",
    kind: "pink",
    height: "crossbar",
  },
  {
    title: "Область специализации 2",
    detail: "междисциплинарность",
    kind: "rose",
    height: "crossbar",
  },
  {
    title: "Основная область специализации",
    detail: "профильная экспертиза",
    kind: "violet",
    height: "deep",
  },
  {
    title: "Область специализации 3",
    detail: "технологический контекст",
    kind: "blue",
    height: "crossbar",
  },
  {
    title: "Область специализации 4",
    detail: "прикладные навыки",
    kind: "mint",
    height: "crossbar",
  },
];

const learningSpaces = [
  {
    title: "Интеллектуальные производственные системы",
    description:
      "Инженерные и управленческие программы для отраслей Индустрии 4.0, беспилотных систем, промышленного инжиниринга и инновационных проектов.",
    programs: [
      "Промышленный инжиниринг",
      "Беспилотные системы и технологии",
      "Беспилотные авиационные системы",
      "Технологии Индустрии 4.0 и управление инновационными проектами",
    ],
  },
  {
    title: "Цифровой город",
    description:
      "Программы на стыке строительства, урбанистики, цифровой трансформации, недвижимости, управления и практической психологии.",
    programs: [
      "Цифровое городское планирование и управление недвижимостью",
      "Цифровое гражданское строительство",
      "Бизнес-инжиниринг и экспертиза в стройиндустрии",
      "Управление цифровой трансформацией",
      "Нейротехнологии в практической психологии",
    ],
  },
  {
    title: "Виртуальные реальности",
    description:
      "Цифровые, креативные и коммуникационные направления: ИИ, игры, web, медиатехнологии и международный бизнес.",
    programs: [
      "Медиатехнологии и инфокоммуникации",
      "Машинное обучение и искусственный интеллект",
      "Разработка игр и прикладных программ",
      "Web-разработка и дизайн",
      "Международный бизнес",
    ],
  },
];

function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 });
    let frame;
    function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
}

function CyberCircuit() {
  return (
    <div className="circuit" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, index) => (
        <span key={index} style={{ "--i": index }} />
      ))}
    </div>
  );
}

function useSectionNavigation() {
  const navigate = useNavigate();

  return (sectionId) => {
    navigate("/");
    window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  };
}

function SectionNavButton({ sectionId, children, className = "" }) {
  const scrollToSection = useSectionNavigation();

  return (
    <button className={className} type="button" onClick={() => scrollToSection(sectionId)}>
      {children}
    </button>
  );
}

function SpecializationGraph() {
  return (
    <div className="t-graph" aria-label="Схема T-shaped специалиста">
      <div className="discipline-axis">
        <span aria-hidden="true">←</span>
        <strong>Дисциплины</strong>
        <span aria-hidden="true">→</span>
      </div>
      <div className="graph-stage">
        <div className="bars" aria-hidden="true">
          {specializationGraph.map((item) => (
            <div
              className={`specialization-bar ${item.kind} ${item.height}`}
              key={item.title}
            >
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </div>
          ))}
        </div>
        <div className="depth-axis">
          <span aria-hidden="true">↑</span>
          <strong>Глубина экспертизы</strong>
          <span aria-hidden="true">↓</span>
        </div>
      </div>
    </div>
  );
}

function Header({ theme, onThemeToggle }) {
  const scrollToSection = useSectionNavigation();
  const isDark = theme === "dark";

  return (
    <header className="header">
      <Link className="brand" to="/">
        <span className="brand-mark">T</span>
        <span>Т-университет</span>
      </Link>
      <nav aria-label="Главная навигация">
        <button type="button" onClick={() => scrollToSection("about")}>О проекте</button>
        <button type="button" onClick={() => scrollToSection("institute")}>Институт</button>
        <button type="button" onClick={() => scrollToSection("programs")}>Направления</button>
        <button type="button" onClick={() => scrollToSection("model")}>Модель</button>
        <button
          className="theme-toggle"
          type="button"
          onClick={onThemeToggle}
          aria-label={isDark ? "Включить светлую тему" : "Включить темную тему"}
          title={isDark ? "Светлая тема" : "Темная тема"}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </nav>
    </header>
  );
}

function HomePage() {
  const [query, setQuery] = useState("");
  const [parent] = useAutoAnimate();
  const filteredPrograms = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return programs;
    return programs.filter((program) =>
      [
        program.code,
        program.field,
        program.title,
        program.tag,
        program.concept,
        program.goal,
        ...program.disciplines,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  useEffect(() => {
    const items = gsap.utils.toArray(".reveal");
    const triggers = items.map((item) =>
      gsap.fromTo(
        item,
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 82%" },
        },
      ),
    );
    return () => triggers.forEach((trigger) => trigger.scrollTrigger?.kill());
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Институт сквозных технологий ДГТУ
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <span>Т-</span>
            <span>университет</span>
          </motion.h1>
          <motion.p
            className="hero-text"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
          >
            Образовательное пространство с индивидуальными траекториями,
            авторскими курсами практиков и программами, собранными вокруг
            ключевых технологических трендов.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24 }}
          >
            <SectionNavButton className="button primary" sectionId="programs">
              Направления <ArrowRight size={18} />
            </SectionNavButton>
            <SectionNavButton className="button ghost" sectionId="about">
              Модель обучения
            </SectionNavButton>
          </motion.div>
        </div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.7 }}
        >
          <CyberCircuit />
          <div className="orbital">
            <Orbit size={84} />
            <span>8</span>
          </div>
          <div className="signal-card one">AI</div>
          <div className="signal-card two">BIM</div>
          <div className="signal-card three">UAV</div>
          <div className="visual-caption">
            <strong>8 направлений</strong>
            <span>индивидуальные технологические траектории</span>
          </div>
        </motion.div>
      </section>

      <section className="section reveal" id="about">
        <div className="section-heading">
          <p className="eyebrow">О проекте</p>
          <h2>Индивидуальная образовательная траектория вместо шаблонного маршрута</h2>
        </div>
        <div className="about-grid">
          <p>
            Институт сотрудничает с ведущими университетами и
            высокотехнологичными компаниями, реализует авторские курсы от
            практиков, программы академической мобильности, языковую и
            фундаментальную подготовку.
          </p>
          <p>
            Студенты формируют собственный профиль компетенций и развивают
            навыки для карьеры в российских и международных компаниях.
          </p>
        </div>
      </section>

      <section className="stats reveal" aria-label="Ключевые преимущества">
        <div>
          <strong>8</strong>
          <span>образовательных профилей</span>
        </div>
        <div>
          <strong>4IR</strong>
          <span>технологии четвертой промышленной революции</span>
        </div>
        <div>
          <strong>360°</strong>
          <span>связь с индустрией, наукой и практикой</span>
        </div>
      </section>

      <section className="section institute-section reveal" id="institute">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Институт сквозных технологий</p>
            <h2>Т-университет готовит специалистов с глубиной профессии и шириной технологического кругозора</h2>
          </div>
          <p className="section-lead">
            В основе модели лежит концепция T-shaped специалиста: сильная экспертиза в основной области
            и способность работать в смежных дисциплинах, командах и новых технологических контекстах.
          </p>
        </div>

        <div className="benefit-grid">
          {instituteBenefits.map((benefit, index) => (
            <motion.article
              className="benefit-card"
              key={benefit}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{benefit}</p>
            </motion.article>
          ))}
        </div>

        <div className="principles-panel">
          <div>
            <p className="eyebrow">Принципы</p>
            <h3>Глубина экспертизы + ширина дисциплинарных знаний</h3>
            <p>
              Студент строит индивидуальную траекторию: углубляется в основную
              специализацию и одновременно собирает смежные области, нужные для
              командной работы и новых технологических рынков.
            </p>
          </div>
          <SpecializationGraph />
        </div>

        <div className="section-heading subspace-heading">
          <p className="eyebrow">Образовательные подпространства</p>
          <h2>Три фокуса для актуальных программ</h2>
        </div>
        <div className="space-grid">
          {learningSpaces.map((space) => (
            <article className="space-card" key={space.title}>
              <h3>{space.title}</h3>
              <p>{space.description}</p>
              <ul>
                {space.programs.map((program) => (
                  <li key={program}>{program}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section reveal" id="programs">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Направления</p>
            <h2>Программы, собранные вокруг технологий будущего</h2>
          </div>
          <label className="search">
            <span>Поиск</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="AI, BIM, 09.03.02..."
            />
          </label>
        </div>
        <div className="program-grid" ref={parent}>
          {filteredPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </section>

      <section className="section reveal" id="model">
        <div className="section-heading">
          <p className="eyebrow">Задачи института</p>
          <h2>Флагманская модель, где образование связано с индустрией</h2>
        </div>
        <div className="task-grid">
          {tasks.map((task, index) => (
            <motion.div
              className="task"
              key={task}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{task}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}

function ProgramCard({ program }) {
  const Icon = program.icon;
  return (
    <motion.article className={`program-card ${program.tone}`} whileHover={{ y: -8 }}>
      <div className="card-top">
        <span className="icon"><Icon size={24} /></span>
        <span className="tag">{program.tag}</span>
      </div>
      <p className="code">{program.code}</p>
      <h3>{program.title}</h3>
      <p>{program.concept}</p>
      <div className="card-bottom">
        <span>{program.room}</span>
        <Link to={`/program/${program.id}`} aria-label={`Открыть ${program.title}`}>
          <ArrowRight size={18} />
        </Link>
      </div>
    </motion.article>
  );
}

function ProgramPage() {
  const { id } = useParams();
  const program = programs.find((item) => item.id === id) ?? programs[0];
  const Icon = program.icon;

  return (
    <motion.main
      className="program-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Link className="back-link" to="/">
        <ArrowLeft size={18} /> На главную
      </Link>
      <section className={`program-hero ${program.tone}`}>
        <div>
          <p className="eyebrow">{program.code} · {program.field}</p>
          <h1>{program.title}</h1>
          <p>{program.concept}</p>
        </div>
        <Icon size={112} />
      </section>
      <section className="program-detail">
        <article>
          <h2>Цели и задачи</h2>
          <p>{program.goal}</p>
        </article>
        <article>
          <h2>Основные дисциплины</h2>
          <ul>
            {program.disciplines.map((discipline) => (
              <li key={discipline}>{discipline}</li>
            ))}
          </ul>
        </article>
      </section>
    </motion.main>
  );
}

export default function App() {
  useSmoothScroll();
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return window.localStorage.getItem("t-university-theme") ?? "dark";
  });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("t-university-theme", theme);
  }, [theme]);

  return (
    <div className="app">
      <motion.div className="progress" style={{ scaleX }} />
      <CyberCircuit />
      <Header
        theme={theme}
        onThemeToggle={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/program/:id" element={<ProgramPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </AnimatePresence>
      <footer className="footer">
        <span>Т-университет · Институт сквозных технологий ДГТУ</span>
        <SectionNavButton sectionId="programs">К направлениям</SectionNavButton>
      </footer>
    </div>
  );
}
