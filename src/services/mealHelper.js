// Import a helper function that converts a backend meal type to a UI-friendly meal type
import { toUiMealType } from "./mealApi";

// Define a constant array that describes the different meal sections in the app
export const MEAL_SECTIONS = [
  // Configuration object for the "breakfast" section
  {
    // Unique key used internally to identify this section
    key: "breakfast",
    // Readable title shown in the UI
    title: "Breakfast",
    // Short description explaining the purpose of this section
    description: "Start the day with your first meal.",
  },
  // Configuration object for the "lunch" section
  {
    // Unique key used internally to identify this section
    key: "lunch",
    // Readable title shown in the UI
    title: "Lunch",
    // Short description explaining the purpose of this section
    description: "Track your midday meals and quick bites.",
  },
  // Configuration object for the "dinner" section
  {
    // Unique key used internally to identify this section
    key: "dinner",
    // Readable title shown in the UI
    title: "Dinner",
    // Short description explaining the purpose of this section
    description: "Keep your evening meals in one place.",
  },
  // Configuration object for the "snacks" section
  {
    // Unique key used internally to identify this section
    key: "snacks",
    // Readable title shown in the UI
    title: "Snacks",
    // Short description explaining the purpose of this section
    description: "Log everything in between the main meals.",
  },
];

// Create and return an object that represents an empty day of meals
export function createEmptyDayMeals() {
  // Each meal type starts as an empty array, ready to hold meal entries
  return {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };
}

// Convert a Date object into a string key in "YYYY-MM-DD" format
export function formatDateKey(date) {
  // Turn the date into an ISO string, split at the "T", and take the date part only
  return date.toISOString().split("T")[0];
}

// Given a date string, find the Date object representing the Monday of that week
export function getStartOfWeek(dateString) {
  // Create a Date object from the string, forcing a midday time to avoid timezone edge cases
  const date = new Date(`${dateString}T12:00:00`);
  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = date.getDay();
  // Calculate how many days to move to get back to Monday (or forward from Sunday)
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  // Adjust the date by the offset to land on Monday
  date.setDate(date.getDate() + offset);
  // Return the Date object representing the start of the week
  return date;
}

// Build an array of 7 day objects (one for each day of the week) starting from the given date's week
export function buildWeekDays(dateString) {
  // Get the Date object for the Monday of the week that contains the given date
  const startOfWeek = getStartOfWeek(dateString);

  // Create an array of length 7 and map each index to a day object
  return Array.from({ length: 7 }, (_, index) => {
    // Create a new Date object based on the start of the week
    const date = new Date(startOfWeek);
    // Move the date forward by the current index (0–6)
    date.setDate(startOfWeek.getDate() + index);

    // Return an object describing this specific day
    return {
      // Use the formatted date string as a unique key (YYYY-MM-DD)
      key: formatDateKey(date),
      // Full weekday name (e.g., "Monday") for display
      label: date.toLocaleDateString("en-US", { weekday: "long" }),
      // Short date format (e.g., "Jan 5") for compact display
      shortDate: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  });
}

// Group a list of meal objects by day, organizing them into meal types for each date
export function groupMealsByDay(meals) {
  // Use reduce to build up an accumulator object keyed by date
  return meals.reduce((acc, meal) => {
    // Support both "meal_date" (backend) and "mealDate" (frontend) formats
    const rawDate = meal.meal_date ?? meal.mealDate;
    // If the date is a string, strip off any time part by splitting at "T"
    const dateKey =
      typeof rawDate === "string" ? rawDate.split("T")[0] : rawDate;

    // Support both "mealType" (UI) and "meal_type" (backend) formats
    const mealType = meal.mealType ?? toUiMealType(meal.meal_type);

    // If we are missing either the date or the meal type, skip this meal
    if (!dateKey || !mealType) {
      return acc;
    }

    // If this date has not been seen yet, initialize it with empty meal arrays
    if (!acc[dateKey]) {
      acc[dateKey] = createEmptyDayMeals();
    }

    // Only proceed if the meal type exists as a key for this date
    if (acc[dateKey][mealType]) {
      // Push a normalized meal object into the appropriate meal type array
      acc[dateKey][mealType].push({
        // Unique identifier for the meal
        id: meal.id,
        // Use the meal name if available, otherwise fall back to a generic label
        name: meal.name || `${mealType} meal`,
        // Store the normalized date key for this meal
        mealDate: dateKey,
        // Ensure ingredients is always an array; default to an empty array if not
        ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [],
      });
    }

    // Return the accumulator so reduce can continue
    return acc;
  }, {});
}
