import { useEffect, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import MealSection from "../components/MealSection";
import MealPickerDialog from "../components/MealPickerDialog";
import {
  buildWeekDays,
  createEmptyDayMeals,
  groupMealsByDay,
  MEAL_SECTIONS,
} from "../features/mealHelper";
import { createMeal, deleteMeal, fetchMeals } from "../features/mealApi";
import { getMealTemplates } from "../features/mealTableApi";

const pageSx = {
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  minHeight: "100vh",
  py: 6,
  px: 2,
};

const contentSx = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: "90rem",
  gap: 3,
};

const headerSx = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
};

const controlsCardSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  justifyContent: "space-between",
  alignItems: { xs: "flex-start", sm: "center" },
  gap: 2,
  p: 2,
};

const dateInputSx = {
  font: "inherit",
  p: 1.5,
  borderRadius: "4px",
  border: "1px solid",
  borderColor: "divider",
};

const weekGridSx = {
  display: "grid",
  gridTemplateColumns: "repeat(7, minmax(180px, 1fr))",
  gap: 2,
  alignItems: "start",
  overflowX: "auto",
};

const dayColumnSx = {
  minWidth: "180px",
  p: 2,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

function addMealToWeek(currentMeals, dateKey, mealType, meal) {
  const nextMeals = { ...currentMeals };
  const dayMeals = nextMeals[dateKey] ?? createEmptyDayMeals();

  nextMeals[dateKey] = {
    ...dayMeals,
    [mealType]: [...dayMeals[mealType], meal],
  };

  return nextMeals;
}

export default function DailyLogPage() {
  const { token } = useAuth();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  // `weeklyMeals` is the rendered log state: one week, grouped by day, then meal type.
  const [weeklyMeals, setWeeklyMeals] = useState({});
  // `savedMeals` are reusable templates created on the Meals page and shown in the picker.
  const [savedMeals, setSavedMeals] = useState([]);
  // Tracks which day + meal section is currently selecting from the picker dialog.
  const [activeSelection, setActiveSelection] = useState(null);
  const [error, setError] = useState(null);

  // The selected date controls which Monday-Sunday week is on screen.
  const weekDays = buildWeekDays(selectedDate);
  const activeSection = MEAL_SECTIONS.find(
    (section) => section.key === activeSelection?.mealType,
  );
  const activeDay = weekDays.find((day) => day.key === activeSelection?.dateKey);
  const selectableMeals = savedMeals.filter(
    (meal) => meal.mealType === activeSelection?.mealType,
  );

  useEffect(() => {
    async function loadMeals() {
      if (!token) {
        setError("You must be logged in.");
        return;
      }

      try {
        // Load persisted meal entries from the backend and reusable templates
        // from local storage so the picker can offer previously saved meals.
        const [meals, templates] = await Promise.all([
          fetchMeals(token),
          Promise.resolve(getMealTemplates()),
        ]);

        setSavedMeals(templates);
        setWeeklyMeals(groupMealsByDay(meals));
        setError(null);
      } catch (loadError) {
        setError(loadError.message || "Could not load meals.");
      }
    }

    loadMeals();
  }, [token]);

  const handleOpenMealPicker = (event, dateKey, mealType) => {
    event.currentTarget.blur();
    requestAnimationFrame(() => {
      setActiveSelection({ dateKey, mealType });
    });
  };

  const handleCloseMealPicker = () => {
    setActiveSelection(null);
  };

  const handleCreateMeal = async (mealTemplate) => {
    if (!activeSelection || !token) {
      setError("You must be logged in to create a meal.");
      return;
    }

    try {
      // The backend creates the dated meal entry. If the user picked a saved
      // template, we keep its display name and ingredient list in local UI state.
      const createdMeal = await createMeal({
        mealDate: activeSelection.dateKey,
        mealType: activeSelection.mealType,
        token,
      });

      const nextMeal = {
        id: createdMeal.id,
        name:
          mealTemplate?.name ||
          createdMeal.name ||
          `${activeSelection.mealType} meal`,
        mealDate: activeSelection.dateKey,
        ingredients: mealTemplate?.ingredients ?? [],
      };

      // Create on the backend, then mirror that change in the weekly UI state.
      setWeeklyMeals((current) =>
        addMealToWeek(
          current,
          activeSelection.dateKey,
          activeSelection.mealType,
          nextMeal,
        ),
      );

      setError(null);
      handleCloseMealPicker();
    } catch (createError) {
      setError(createError.message || "Could not create meal.");
    }
  };

  const handleDeleteMeal = async (meal, mealDate, mealType) => {
    try {
      await deleteMeal(meal.id, token);

      // Remove the meal from the currently rendered week after the backend delete succeeds.
      setWeeklyMeals((current) => ({
        ...current,
        [mealDate]: {
          ...(current[mealDate] ?? createEmptyDayMeals()),
          [mealType]: (current[mealDate]?.[mealType] ?? []).filter(
            (currentMeal) => currentMeal.id !== meal.id,
          ),
        },
      }));

      setError(null);
    } catch (deleteError) {
      setError(deleteError.message || "Could not delete meal.");
    }
  };

  return (
    <Box sx={pageSx}>
      <Box sx={contentSx}>
        <Box sx={headerSx}>
          <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center" }}>
            Daily Log
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            Build your whole week from Monday through Sunday. Each day has its
            own breakfast, lunch, dinner, and snacks log.
          </Typography>
          {error ? (
            <Typography color="error" sx={{ textAlign: "center" }}>
              {error}
            </Typography>
          ) : null}
        </Box>

        <Paper elevation={1} sx={controlsCardSx}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Select Any Date In The Week
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The week view updates automatically from Monday through Sunday.
            </Typography>
          </Box>
          <Box
            component="input"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            sx={dateInputSx}
          />
        </Paper>

        {/* Render one column per day, then let each column render its meal sections. */}
        <Box sx={weekGridSx}>
          {weekDays.map((day) => {
            const mealsForDay = weeklyMeals[day.key] ?? createEmptyDayMeals();

            return (
              <Paper key={day.key} elevation={1} sx={dayColumnSx}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {day.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {day.shortDate}
                  </Typography>
                </Box>

                {MEAL_SECTIONS.map((section) => (
                  <MealSection
                    key={`${day.key}-${section.key}`}
                    title={section.title}
                    meals={mealsForDay[section.key]}
                    onAdd={(event) =>
                      handleOpenMealPicker(event, day.key, section.key)
                    }
                    onDelete={(meal) =>
                      handleDeleteMeal(meal, day.key, section.key)
                    }
                  />
                ))}
              </Paper>
            );
          })}
        </Box>

        <MealPickerDialog
          activeDay={activeDay}
          activeSection={activeSection}
          meals={selectableMeals}
          open={Boolean(activeSection && activeDay)}
          onClose={handleCloseMealPicker}
          onSelectMeal={handleCreateMeal}
        />
      </Box>
    </Box>
  );
}
