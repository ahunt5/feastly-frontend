const API_PREFIX = import.meta.env.VITE_API || "/api";

async function parseResponse(response) {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function generateRecipeSuggestions({ token, ingredients, diets }) {
  const res = await fetch(`${API_PREFIX}/askAI/recipe-suggestions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ingredients, diets }),
  });

  const data = await parseResponse(res);
  if (!res.ok) {
    throw new Error(
      data?.message || data?.error || "Failed to generate recipes.",
    );
  }

  return Array.isArray(data.suggestions) ? data.suggestions : [];
}
