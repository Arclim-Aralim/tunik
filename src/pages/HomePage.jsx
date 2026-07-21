import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  instituteBenefits,
  learningSpaces,
  learningSteps,
  programs,
  tasks,
} from "../data/siteData";
import { SectionNavButton } from "../components/SectionNavButton";
import { SpecializationGraph } from "../components/SpecializationGraph";
import { ProgramCard } from "../components/ProgramCard";
import { ArrowRightIcon } from "../icons/AppIcons";

export function HomePage() {
  const [query, setQuery] = useState("");
  const location = useLocation();

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
    const sectionId = location.state?.scrollTarget ?? location.hash.slice(1);
    if (!sectionId) return;

    const timers = [80, 220].map((delay) =>
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, delay),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [location.hash, location.state]);

  useEffect(() => {
    const items = [...document.querySelectorAll(".reveal")];

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -16% 0px", threshold: 0 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="hero hero-centered">
        <div className="hero-copy">
          <p className="eyebrow hero-intro hero-intro-0">
            Институт сквозных технологий ДГТУ
          </p>
          <h1 className="hero-intro hero-intro-1">
            <span>Т-университет</span>
          </h1>
          <p className="hero-text hero-intro hero-intro-2">
            Образовательное пространство с персональными учебными сценариями, авторскими
            курсами практиков и программами, собранными вокруг ключевых технологических
            трендов.
          </p>
          <div className="hero-actions hero-intro hero-intro-3">
            <SectionNavButton className="button primary" sectionId="programs">
              Направления <ArrowRightIcon size={18} />
            </SectionNavButton>
            <SectionNavButton className="button ghost" sectionId="model">
              Модель обучения
            </SectionNavButton>
          </div>
        </div>
      </section>

      <section className="section reveal" id="model">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Задачи института</p>
            <h2>Флагманская модель, где образование связано с индустрией</h2>
          </div>
          <p className="section-lead">
            Мир изменился - образование тоже должно измениться. Современному специалисту
            недостаточно знать только свою специальность. Нужно понимать технологии, людей,
            бизнес и уметь учиться всю жизнь.
          </p>
        </div>

        <div className="model-switch">
          <h3>Мир изменился - образование тоже должно измениться</h3>
          <div className="model-switch-grid">
            <article>
              <span>Раньше</span>
              <p>Получил профессию - работаешь всю жизнь.</p>
            </article>
            <article>
              <span>Сейчас</span>
              <p>
                Современному специалисту недостаточно знать только свою специальность. Нужно
                понимать технологии, людей, бизнес и уметь учиться всю жизнь.
              </p>
            </article>
          </div>
        </div>

        <div className="learning-plan">
          <div className="section-heading learning-heading">
            <p className="eyebrow">Как устроено обучение</p>
            <button
              className="inline-tooltip"
              type="button"
              aria-label="Подсказка про элективы"
            >
              i
              <span className="inline-tooltip-panel">
                <span>
                  Элективы - это обязательные курсы по выбору, которые позволяют сделать
                  образование индивидуальным.
                </span>
                <span>
                  Помимо основной программы, ты сам выбираешь дополнительные дисциплины и
                  формируешь траекторию обучения, которую сам хочешь.
                </span>
                <span>
                  Так каждый студент получает не шаблонный диплом, а уникальный набор
                  компетенций, соответствующий его интересам и карьерным целям.
                </span>
              </span>
            </button>
          </div>
          <div className="learning-grid">
            {learningSteps.map((step, index) => (
              <article
                className={`learning-card${index === learningSteps.length - 1 ? " full" : ""}`}
                key={step.title}
              >
                <span>
                  {step.number} {step.title}
                </span>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="task-grid">
          {tasks.map((task, index) => (
            <div
              className="task lift-on-hover"
              key={task.title}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>
                <strong>{task.title}</strong>
                <br />
                {task.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal" id="about">
        <div className="section-heading">
          <p className="eyebrow">О Т-университете</p>
          <h2>Индивидуальная траектория обучения вместо шаблонной программы</h2>
        </div>
        <div className="about-grid">
          <p>
            Институт сотрудничает с ведущими университетами и высокотехнологичными компаниями,
            реализует авторские курсы от практиков, программы академической мобильности,
            языковую и фундаментальную подготовку.
          </p>
          <p>
            Студенты формируют собственный профиль компетенций и развивают навыки для карьеры в
            российских и международных компаниях.
          </p>
          <div className="t-explain">
            <div className="t-explain-head">
              <span className="t-explain-badge">T</span>
              <strong>Что такое T?</strong>
            </div>
            <p>
              Таким образом, Т-специалист - тот, кто обладает отлично развитой компетенцией в
              своей основной специализации, и при этом на начальном или среднем уровне
              разбирается в смежных областях деятельности команды.
            </p>
          </div>
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
            В основе модели лежит концепция T-shaped специалиста: сильная экспертиза в основной
            области и способность работать в смежных дисциплинах, командах и новых
            технологических контекстах.
          </p>
        </div>

        <div className="principles-panel">
          <div>
            <p className="eyebrow">Принципы</p>
            <h3>Глубина экспертизы + ширина дисциплинарных знаний</h3>
            <p>
              Студент строит персональный учебный сценарий: углубляется в основную
              специализацию и одновременно собирает смежные области, нужные для командной
              работы и новых технологических рынков.
            </p>
          </div>
          <SpecializationGraph />
        </div>

        <div className="benefit-grid">
          {instituteBenefits.map((benefit, index) => (
            <article
              className="benefit-card lift-on-hover"
              key={benefit}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{benefit}</p>
            </article>
          ))}
        </div>

        <div className="section-heading subspace-heading">
          <p className="eyebrow">Среды подготовки</p>
          <h2>Три профессиональные среды, где технологии встречаются с практикой</h2>
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
        <div
          className="program-grid search-results"
          key={query.trim().toLowerCase() || "all-programs"}
        >
          {filteredPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      </section>
    </>
  );
}
