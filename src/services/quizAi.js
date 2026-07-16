const API_URL = import.meta.env.VITE_QUIZ_AI_URL ?? "http://localhost:5087/api/recommend";

export async function requestQuizRecommendation(answers) {
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
