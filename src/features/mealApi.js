const API_PREFIX = "/api";

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
    throw new Error(data?.message || data?.error || "Meal request failed.");
  }

  return data;
}

const UI_TO_API_MEAL_TYPE = {
  breakfast: "breakfast",
  lunch: "lunch",
  dinner: "dinner",
  snacks: "snack",
};

const API_TO_UI_MEAL_TYPE = {
  breakfast: "breakfast",
  lunch: "lunch",
  dinner: "dinner",
  snack: "snacks",
};

export function toApiMealType(mealType) {
  return UI_TO_API_MEAL_TYPE[mealType] ?? mealType;
}

export function toUiMealType(mealType) {
  return API_TO_UI_MEAL_TYPE[mealType] ?? mealType;
}

export async function fetchMeals(token) {
  const meals = await apiRequest("/meals", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return meals.map((meal) => ({
    ...meal,
    mealType: toUiMealType(meal.meal_type),
  }));
}

export async function createMeal({ mealDate, mealType, token }) {
  return apiRequest("/meals", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      mealDate,
      mealType: toApiMealType(mealType),
    }),
  });
}

export async function deleteMeal(id, token) {
  return apiRequest(`/meals/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
