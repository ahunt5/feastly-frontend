import { Box, Button, Paper, Typography } from "@mui/material";
// Importing Material UI components for layout, buttons, cards, and text

// Component definition. It receives props: title, meals array, onAdd handler, and optional onDelete handler.
export default function MealSection({ title, meals, onAdd, onDelete }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      {/* Outer container with a bordered card style and padding */}

      <Typography variant="subtitle1" fontWeight="bold">
        {/* Displays the section title (e.g., Breakfast, Lunch, Dinner) */}
        {title}
      </Typography>
      {/* Add meal button */}
      <Button type="button" variant="outlined" size="small" onClick={onAdd}>
        {/* Button that triggers the onAdd callback when clicked */}
        Add {title}
      </Button>

      {/* Conditional rendering: if there are no meals, show a placeholder message */}
      {meals.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {/* Message shown when the meals array is empty */}
          No items yet
        </Typography>
      ) : (
        // If meals exist, render them inside a vertical flex container
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          {meals.map((meal, index) => (
            // Loop through each meal and render it inside its own Paper card
            <Paper key={meal.id} variant="outlined" sx={{ p: 1 }}>
              {/* Display the meal number and name. If name is missing, show a fallback label */}
              <Typography variant="body2">
                {index + 1}. {meal.name || `${title} meal`}
              </Typography>

              {/* Only show the delete button if onDelete was provided */}
              {onDelete ? (
                <Button
                  type="button"
                  color="error"
                  size="small"
                  onClick={() => onDelete(meal)}
                  // When clicked, calls onDelete with the specific meal object
                  sx={{ mt: 1 }}
                >
                  Delete
                </Button>
              ) : null}
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
}
