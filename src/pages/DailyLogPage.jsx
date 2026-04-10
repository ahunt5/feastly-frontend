import { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useAuth } from "../auth/AuthContext";

// Reusable UI components for rendering meal sections and the meal picker dialog
import MealSection from "../components/MealSection";
import MealPickerDialog from "../components/MealPickerDialog";

// Helper functions for building week structure and organizing meals
import {
  buildWeekDays, // Generates Monday–Sunday objects based on a selected date
  createEmptyDayMeals, // Returns an empty meal structure for a day
  groupMealsByDay, // Converts backend meal list into { date: { mealType: [...] } }
  MEAL_SECTIONS, // Static config for breakfast/lunch/dinner/snacks
} from "../services/mealHelper";

// API functions for CRUD operations on meals
import { createMeal, deleteMeal, fetchMeals } from "../services/mealApi";

// API functions for working with saved meal templates
import {
  createMealFromTemplate,
  getMealTemplates,
} from "../services/mealTableApi";

// -----------------------------
// Layout style objects
// These keep JSX clean and make layout easy to maintain
// -----------------------------
const pageSx = {
  width: "100%",
};

const contentSx = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: 3,
  minWidth: 0,
};

const weekNavSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "auto 1fr auto" },
  alignItems: "center",
  gap: 2,
  p: { xs: 2, sm: 3 },
  borderRadius: 3,
};

const weekRangeTextSx = {
  textAlign: "center",
};

const controlsCardSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  justifyContent: "space-between",
  alignItems: { xs: "flex-start", sm: "center" },
  gap: 2,
  p: { xs: 2, sm: 3 },
  borderRadius: 3,
};

const dateInputSx = {
  font: "inherit",
  p: 1.5,
  borderRadius: "10px",
  border: "1px solid",
  borderColor: "divider",
  minWidth: { xs: "100%", sm: "220px" },
  backgroundColor: "white",
};

const weekGridWrapperSx = {
  width: "100%",
  overflowX: "hidden",
};

const weekGridSx = {
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: 2,
  alignItems: "start",
};

const dayColumnSx = {
  p: 2,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  borderRadius: 3,
  backgroundColor: "#ffffff",
  minWidth: 0,
};

const activeDayColumnSx = {
  ...dayColumnSx,
  border: "2px solid",
  borderColor: "primary.light",
  backgroundColor: "action.hover",
};

const errorTextSx = {
  mt: -1,
  mb: 1,
  textAlign: "center",
};

// -----------------------------
// Helper: Add a meal to the weekly state immutably
// Ensures React state updates remain pure and predictable
// -----------------------------
function addMealToWeek(currentMeals, dateKey, mealType, meal) {
  const nextMeals = { ...currentMeals };
  const dayMeals = nextMeals[dateKey] ?? createEmptyDayMeals();

  nextMeals[dateKey] = {
    ...dayMeals,
    [mealType]: [...dayMeals[mealType], meal],
  };

  return nextMeals;
}

// -----------------------------
// Helper: Shift the selected date forward or backward
// Used for previous/next week calendar navigation
// -----------------------------
function shiftDateByDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

// -----------------------------
// Main Component
// -----------------------------
export default function DailyLogPage() {
  const { token } = useAuth(); // Logged-in user's token

  // The date selected by the user; determines which week is displayed
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Meals grouped by day and meal type for the currently displayed week
  const [weeklyMeals, setWeeklyMeals] = useState({});

  // Saved reusable meal templates (created on the Meals page)
  const [savedMeals, setSavedMeals] = useState([]);

  // Tracks which day + meal type is currently being edited in the picker dialog
  const [activeSelection, setActiveSelection] = useState(null);

  // Stores error messages from backend operations
  const [error, setError] = useState(null);

  // -----------------------------
  // Derived values based on selected date and active selection
  // -----------------------------

  // Build Monday–Sunday objects for the selected week
  const weekDays = buildWeekDays(selectedDate);

  // The first and last day of the currently displayed week
  const weekStart = weekDays[0];
  const weekEnd = weekDays[weekDays.length - 1];

  // The meal section (breakfast/lunch/etc.) currently being edited
  const activeSection = MEAL_SECTIONS.find(
    (section) => section.key === activeSelection?.mealType,
  );

  // The day object currently being edited
  const activeDay = weekDays.find(
    (day) => day.key === activeSelection?.dateKey,
  );

  // Filter saved templates so the picker only shows templates for the correct meal type
  const selectableMeals = savedMeals.filter(
    (meal) => meal.mealType === activeSelection?.mealType,
  );

  // -----------------------------
  // Load meals + templates when the token becomes available
  // -----------------------------
  useEffect(() => {
    async function loadMeals() {
      if (!token) {
        setError("You must be logged in.");
        return;
      }

      try {
        // Load both meals and templates in parallel for efficiency
        const [meals, templates] = await Promise.all([
          fetchMeals(token),
          getMealTemplates(token),
        ]);

        // Save templates and group meals by day for rendering
        setSavedMeals(templates);
        setWeeklyMeals(groupMealsByDay(meals));
        setError(null);
      } catch (loadError) {
        setError(loadError.message || "Could not load meals.");
      }
    }

    loadMeals();
  }, [token]); // Re-run when user logs in/out

  // -----------------------------
  // Open the meal picker dialog
  // requestAnimationFrame ensures the button loses focus first
  // -----------------------------
  const handleOpenMealPicker = (event, dateKey, mealType) => {
    event.currentTarget.blur();
    requestAnimationFrame(() => {
      setActiveSelection({ dateKey, mealType });
    });
  };

  // Close the meal picker dialog
  const handleCloseMealPicker = () => {
    setActiveSelection(null);
  };

  // -----------------------------
  // Move backward by one week
  // -----------------------------
  const handlePreviousWeek = () => {
    setSelectedDate((currentDate) => shiftDateByDays(currentDate, -7));
  };

  // -----------------------------
  // Move forward by one week
  // -----------------------------
  const handleNextWeek = () => {
    setSelectedDate((currentDate) => shiftDateByDays(currentDate, 7));
  };

  // -----------------------------
  // Create a meal (either from a template or empty)
  // -----------------------------
  const handleCreateMeal = async (mealTemplate) => {
    if (!activeSelection || !token) {
      setError("You must be logged in to create a meal.");
      return;
    }

    try {
      // If a template was selected → use template API
      // Otherwise → create an empty meal
      const createdMeal = mealTemplate?.id
        ? await createMealFromTemplate(
            mealTemplate.id,
            activeSelection.dateKey,
            activeSelection.mealType,
            token,
          )
        : await createMeal({
            mealDate: activeSelection.dateKey,
            mealType: activeSelection.mealType,
            token,
          });

      // Normalize meal shape so UI always receives consistent data
      const nextMeal = {
        id: createdMeal.id,
        name:
          mealTemplate?.name ||
          createdMeal.name ||
          `${activeSelection.mealType} meal`,
        mealDate: activeSelection.dateKey,
        ingredients: createdMeal.ingredients ?? mealTemplate?.ingredients ?? [],
        mealType: activeSelection.mealType,
      };

      // Update UI state immutably
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

  // -----------------------------
  // Delete a meal from backend and UI state
  // -----------------------------
  const handleDeleteMeal = async (meal, mealDate, mealType) => {
    try {
      await deleteMeal(meal.id, token);

      // Remove meal from UI after backend confirms deletion
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

  // -----------------------------
  // Render the page
  // -----------------------------
  return (
    <Box sx={pageSx}>
      <Box sx={contentSx}>
        {/* Error message */}
        {error ? (
          <Typography color="error" sx={errorTextSx}>
            {error}
          </Typography>
        ) : null}

        {/* Week navigation card */}
        <Paper elevation={1} sx={weekNavSx}>
          <Button variant="outlined" onClick={handlePreviousWeek}>
            Previous Week
          </Button>

          <Box sx={weekRangeTextSx}>
            <Typography variant="h6" fontWeight="bold">
              Weekly Meal Calendar
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {weekStart.shortDate} - {weekEnd.shortDate}
            </Typography>
          </Box>

          <Button variant="outlined" onClick={handleNextWeek}>
            Next Week
          </Button>
        </Paper>

        {/* Date selector card */}
        <Paper elevation={1} sx={controlsCardSx}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Select Any Date In The Week
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The week view updates automatically from Monday through Sunday.
            </Typography>
          </Box>

          {/* Date input controls which week is displayed */}
          <Box
            component="input"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            sx={dateInputSx}
          />
        </Paper>

        {/* Week grid: one column per day */}
        <Box sx={weekGridWrapperSx}>
          <Box sx={weekGridSx}>
            {weekDays.map((day) => {
              const mealsForDay = weeklyMeals[day.key] ?? createEmptyDayMeals();

              return (
                <Paper
                  key={day.key}
                  elevation={1}
                  sx={
                    day.key === selectedDate ? activeDayColumnSx : dayColumnSx
                  }
                >
                  {/* Day header */}
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {day.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {day.shortDate}
                    </Typography>
                  </Box>

                  {/* Render breakfast/lunch/dinner/snacks sections */}
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
        </Box>

        {/* Dialog for selecting or creating meals */}
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
