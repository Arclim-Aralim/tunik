const configuredApiUrl = import.meta.env.VITE_QUIZ_AI_URL?.trim() ?? "";
const isLocalBrowser =
  typeof window !== "undefined" &&
  ["localhost", "127.0.0.1"].includes(window.location.hostname);

const API_URL = configuredApiUrl || (isLocalBrowser ? "http://localhost:5087/api/recommend" : "");

export const hasQuizAiEndpoint = Boolean(API_URL);

export async function requestQuizRecommendation(answers) {
  if (!API_URL) {
    throw new Error("Quiz AI endpoint is not configured");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      answers: Object.fromEntries(
        Object.entries(answers).map(([questionIndex, optionIndex]) => [
          Number(questionIndex),
          optionIndex,
        ]),
      ),
    }),
  });

  if (!response.ok) {
    throw new Error(`Quiz AI request failed: ${response.status}`);
  }

  return response.json();
}
