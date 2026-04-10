import { useState } from "react";
import MealSection from "../components/MealSection";
import "../App.css";

const MEAL_SECTIONS = [
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

const SAVED_MEALS = [
  { id: "meal-1", name: "Greek Yogurt Bowl", mealType: "breakfast" },
  { id: "meal-2", name: "Avocado Toast", mealType: "breakfast" },
  { id: "meal-3", name: "Chicken Caesar Wrap", mealType: "lunch" },
  { id: "meal-4", name: "Turkey Sandwich", mealType: "lunch" },
  { id: "meal-5", name: "Salmon and Rice", mealType: "dinner" },
  { id: "meal-6", name: "Pasta Primavera", mealType: "dinner" },
  { id: "meal-7", name: "Protein Bar", mealType: "snacks" },
  { id: "meal-8", name: "Apple with Peanut Butter", mealType: "snacks" },
];

function createEmptyDayMeals() {
  return {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };
}

function formatDateKey(date) {
  return date.toISOString().split("T")[0];
}

function getStartOfWeek(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  const dayOfWeek = date.getDay();
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  date.setDate(date.getDate() + offset);

  return date;
}

function buildWeekDays(dateString) {
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

export default function DailyLogPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [weeklyMeals, setWeeklyMeals] = useState({});
  const [savedMeals] = useState(SAVED_MEALS);
  const [activeSelection, setActiveSelection] = useState(null);

  const weekDays = buildWeekDays(selectedDate);

  const handleOpenMealPicker = (dateKey, mealType) => {
    setActiveSelection({ dateKey, mealType });
  };

  const handleCloseMealPicker = () => {
    setActiveSelection(null);
  };

  const handleSelectMeal = (dateKey, mealType, meal) => {
    setWeeklyMeals((currentMeals) => {
      const mealsForDay = currentMeals[dateKey] ?? createEmptyDayMeals();

      return {
        ...currentMeals,
        [dateKey]: {
          ...mealsForDay,
          [mealType]: [
            ...mealsForDay[mealType],
            {
              id: `${meal.id}-${Date.now()}`,
              name: meal.name,
            },
          ],
        },
      };
    });

    handleCloseMealPicker();
  };

  const activeSection = MEAL_SECTIONS.find(
    (section) => section.key === activeSelection?.mealType,
  );
  const activeDay = weekDays.find(
    (day) => day.key === activeSelection?.dateKey,
  );
  const selectableMeals = savedMeals.filter(
    (meal) => meal.mealType === activeSelection?.mealType,
  );

  return (
    <div>
      <section>
        <div>
          <h1>Daily Log</h1>
          <p>
            Build your whole week from Monday through Sunday. Each day has its
            own breakfast, lunch, dinner, and snacks log.
          </p>
        </div>

        <label>
          <span>Select Any Date In The Week</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
      </section>

      <section className="daily-log-grid">
        {weekDays.map((day) => {
          const mealsForDay = weeklyMeals[day.key] ?? createEmptyDayMeals();

          return (
            <section key={day.key} className="daily-log-day-column">
              <div className="daily-log-day-header">
                <h2>{day.label}</h2>
                <p>{day.shortDate}</p>
              </div>

              {MEAL_SECTIONS.map((section) => (
                <MealSection
                  key={`${day.key}-${section.key}`}
                  title={section.title}
                  meals={mealsForDay[section.key]}
                  onAdd={() => handleOpenMealPicker(day.key, section.key)}
                />
              ))}
            </section>
          );
        })}
      </section>

      {activeSection && activeDay ? (
        <dialog open>
          <div>
            <h2>
              Select a {activeSection.title} Meal for {activeDay.label}
            </h2>
            <p>
              {activeDay.shortDate}. {activeSection.description}
            </p>
          </div>

          {selectableMeals.length === 0 ? (
            <p>No saved {activeSection.title.toLowerCase()} meals yet.</p>
          ) : (
            <div>
              {selectableMeals.map((meal) => (
                <div key={meal.id}>
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectMeal(activeDay.key, activeSection.key, meal)
                    }
                  >
                    {meal.name}
                  </button>
                </div>
              ))}
            </div>
          )}

          <button type="button" onClick={handleCloseMealPicker}>
            Close
          </button>
        </dialog>
      ) : null}
    </div>
  );
}
