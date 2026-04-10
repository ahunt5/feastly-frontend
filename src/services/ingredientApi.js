const API_PREFIX = import.meta.env.VITE_API;

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_PREFIX}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error || "Ingredient request failed.",
    );
  }

  return data;
}

function normalizeIngredient(ingredient) {
  return {
    id: ingredient.id,
    name: ingredient.name,
    calories: ingredient.calories,
    protein: ingredient.protein,
    carbs: ingredient.carbs,
    fat: ingredient.fat,
  };
}

export async function fetchIngredients(token) {
  const ingredients = await apiRequest("/ingredients", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!Array.isArray(ingredients)) return [];
  return ingredients.map(normalizeIngredient);
}
