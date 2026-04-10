export const MEAL_SECTIONS = [
  {
    key: "breakfast",
    title: "Breakfast",
    description: "Start the day with your first meal.",
  },
  {
    key: "lunch",
    title: "Lunch",
    description: "Track your midday meals and quick bites.",
  },
  {
    key: "dinner",
    title: "Dinner",
    description: "Keep your evening meals in one place.",
  },
  {
    key: "snacks",
    title: "Snacks",
    description: "Log everything in between the main meals.",
  },
];

export function createEmptyDayMeals() {
  return {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };
}

export function formatDateKey(date) {
  return date.toISOString().split("T")[0];
}

export function getStartOfWeek(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  const dayOfWeek = date.getDay();
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  date.setDate(date.getDate() + offset);
  return date;
}

export function buildWeekDays(dateString) {
  const startOfWeek = getStartOfWeek(dateString);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);

    return {
      key: formatDateKey(date),
      label: date.toLocaleDateString("en-US", { weekday: "long" }),
      shortDate: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  });
}

export function groupMealsByDay(meals) {
  return meals.reduce((acc, meal) => {
    const dateKey = meal.meal_date;
    const mealType = meal.mealType;

    if (!acc[dateKey]) {
      acc[dateKey] = createEmptyDayMeals();
    }

    if (acc[dateKey][mealType]) {
      acc[dateKey][mealType].push({
        id: meal.id,
        name: meal.name || `${meal.meal_type} meal`,
        mealDate: meal.meal_date,
      });
    }

    return acc;
  }, {});
}
