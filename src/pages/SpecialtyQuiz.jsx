import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { programs, quizQuestions } from "../data/siteData";
import { requestQuizRecommendation } from "../services/quizAi";

const TRAIT_ORDER = [
  "engineering",
  "data",
  "creative",
  "business",
  "physical",
  "communication",
  "research",
];

const TRAIT_LABELS = {
  engineering: "Инженерия",
  data: "Данные",
  creative: "Креатив",
  business: "Бизнес",
  physical: "Практика",
  communication: "Команда",
  research: "Исследование",
};

const TRAIT_PERSON_DESCRIPTIONS = {
  engineering: "ты любишь разбирать сложные системы и доводить идеи до работающей конструкции",
  data: "тебе близко мышление через данные, закономерности и проверяемые гипотезы",
  creative: "тебе важно придумывать форму, опыт и понятный для человека продукт",
  business: "ты хорошо чувствуешь стратегию, пользу решения и связь с рынком",
  physical: "тебе интересны реальные устройства, прототипы и задачи, которые можно потрогать руками",
  communication: "ты умеешь связывать людей, смыслы и продуктовую ценность",
  research: "тебе подходит исследовательский темп: глубина, эксперименты и поиск причин",
};

const TRAIT_PROFILES = {
  construction: { engineering: 92, data: 58, creative: 32, business: 36, physical: 88, communication: 44, research: 46 },
  ai: { engineering: 84, data: 98, creative: 40, business: 42, physical: 18, communication: 48, research: 94 },
  games: { engineering: 62, data: 46, creative: 94, business: 38, physical: 20, communication: 58, research: 34 },
  "web-design": { engineering: 50, data: 44, creative: 96, business: 40, physical: 14, communication: 86, research: 28 },
  media: { engineering: 48, data: 56, creative: 70, business: 72, physical: 22, communication: 92, research: 42 },
  robotics: { engineering: 96, data: 52, creative: 30, business: 34, physical: 94, communication: 42, research: 82 },
  aviation: { engineering: 88, data: 46, creative: 36, business: 30, physical: 98, communication: 38, research: 66 },
  business: { engineering: 34, data: 60, creative: 42, business: 98, physical: 22, communication: 88, research: 54 },
};

function buildUserTraits(answers) {
  const totals = Object.fromEntries(TRAIT_ORDER.map((trait) => [trait, 0]));
  let weightTotal = 0;

  Object.entries(answers).forEach(([questionIndex, optionIndex]) => {
    const option = quizQuestions[Number(questionIndex)]?.options?.[optionIndex];
    if (!option) return;

    Object.entries(option.scores).forEach(([programId, score]) => {
      const profile = TRAIT_PROFILES[programId];
      if (!profile) return;

      TRAIT_ORDER.forEach((trait) => {
        totals[trait] += profile[trait] * score;
      });
      weightTotal += score;
    });
  });

  if (!weightTotal) return {};

  return Object.fromEntries(
    TRAIT_ORDER.map((trait) => [trait, Math.round(totals[trait] / weightTotal)]),
  );
}

export function SpecialtyQuiz() {
  const [answers, setAnswers] = useState({});
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [aiStatus, setAiStatus] = useState("idle");
  const answeredCount = Object.keys(answers).length;
  const hasAnswers = answeredCount > 0;

  const localResult = useMemo(() => {
    if (!hasAnswers) return null;

    const scores = quizQuestions.reduce((result, question, questionIndex) => {
      const optionIndex = answers[questionIndex];
      if (optionIndex === undefined) return result;

      Object.entries(question.options[optionIndex].scores).forEach(([programId, score]) => {
        result[programId] = (result[programId] ?? 0) + score;
      });

      return result;
    }, {});

    return programs
      .map((program) => ({ ...program, score: scores[program.id] ?? 0 }))
      .sort((left, right) => right.score - left.score)[0] ?? programs[0];
  }, [answers, hasAnswers]);

  useEffect(() => {
    if (!answeredCount) {
      setAiRecommendation(null);
      setAiStatus("idle");
      return;
    }

    const controller = new AbortController();
    setAiStatus("loading");

    const timer = window.setTimeout(() => {
      requestQuizRecommendation(answers)
        .then((recommendation) => {
          if (controller.signal.aborted) return;
          setAiRecommendation(recommendation);
          setAiStatus("ready");
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setAiRecommendation(null);
          setAiStatus("offline");
        });
    }, 180);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [answers, answeredCount]);

  const result = aiRecommendation
    ? programs.find((program) => program.id === aiRecommendation.programId) ?? localResult
    : localResult;
  const resultTone = result?.tone ?? "mint";

  const userTraits = useMemo(() => buildUserTraits(answers), [answers]);

  const chartTraits = useMemo(
    () =>
      TRAIT_ORDER.map((key) => ({
        key,
        label: TRAIT_LABELS[key],
        value: Number(userTraits?.[key] ?? 0),
      })),
    [userTraits],
  );

  const topTraits = useMemo(
    () => [...chartTraits].sort((left, right) => right.value - left.value),
    [chartTraits],
  );

  const personSummary = useMemo(() => {
    if (!hasAnswers) {
      return "Ответь на вопросы, и здесь появится описание твоего профиля: как тебе комфортнее думать, работать и развиваться.";
    }

    const [first, second] = topTraits;
    const firstText = TRAIT_PERSON_DESCRIPTIONS[first?.key] ?? "у тебя выражен технологический интерес";
    const secondText = TRAIT_PERSON_DESCRIPTIONS[second?.key] ?? "при этом тебе важна широта задач";

    return `По ответам видно: ${firstText}. Ещё одна сильная сторона — ${secondText}. Поэтому направление ниже выглядит как хорошая точка старта, а не как единственный возможный выбор.`;
  }, [hasAnswers, topTraits]);

  return (
    <section className="section quiz-section reveal" id="quiz">
      <div className="section-heading split">
        <div>
          <p className="eyebrow">Мини-тест</p>
          <h2>Какая специальность тебе подходит?</h2>
        </div>
        <p className="section-lead">
          Ответь на вопросы, и тест подберёт направление по твоим интересам,
          стилю задач и комфортному формату работы.
        </p>
      </div>

      <div className="quiz-layout">
        <div className="quiz-questions">
          {quizQuestions.map((question, questionIndex) => (
            <article className="quiz-card" key={question.question}>
              <span>{String(questionIndex + 1).padStart(2, "0")}</span>
              <h3>{question.question}</h3>
              <div className="quiz-options">
                {question.options.map((option, optionIndex) => (
                  <button
                    className={answers[questionIndex] === optionIndex ? "active" : ""}
                    key={option.label}
                    type="button"
                    onClick={() =>
                      setAnswers((current) => ({
                        ...current,
                        [questionIndex]: optionIndex,
                      }))
                    }
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>

        <aside className={`quiz-result ${resultTone}`}>
          <p className="eyebrow">{aiStatus === "ready" ? "Рекомендация" : "Результат"}</p>
          <strong>{answeredCount}/{quizQuestions.length}</strong>
          <h3>{hasAnswers ? "Твой профиль" : "Начни тест"}</h3>
          <p>{personSummary}</p>

          {result && (
            <div className="quiz-program-fit">
              <span>Подходящее направление</span>
              <b>{result.title}</b>
            </div>
          )}

          {hasAnswers && (
            <div className="quiz-traits" aria-label="График профиля результата">
              {chartTraits.map((trait) => (
                <div className="quiz-trait" key={trait.key}>
                  <div className="quiz-trait-head">
                    <span>{trait.label}</span>
                    <strong>{trait.value}%</strong>
                  </div>
                  <div className="quiz-trait-track">
                    <motion.span
                      className="quiz-trait-fill"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: Math.max(trait.value / 100, 0.08) }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="ai-status">
            {aiStatus === "loading" && "Подбираем направление по ответам..."}
            {aiStatus === "offline" && "Показан предварительный результат."}
            {aiStatus === "ready" && `Уверенность: ${Math.round(aiRecommendation.confidence * 100)}%`}
          </div>

          {aiRecommendation?.reasons?.length > 0 && (
            <ul className="ai-reasons">
              {aiRecommendation.reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          )}

          <div className="quiz-result-actions">
            {result ? (
              <Link to={`/program/${result.id}`}>Открыть программу</Link>
            ) : (
              <button type="button" disabled>
                Сначала пройди тест
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setAiRecommendation(null);
                setAiStatus("idle");
              }}
            >
              Сбросить
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
