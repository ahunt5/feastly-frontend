import { Box, Button, Paper, Typography } from "@mui/material";
// Importing Material UI components for layout, buttons, cards, and text

// Component definition. It receives props: title, meals array, onAdd handler, and optional onDelete handler.
export default function MealSection({ title, meals, onAdd, onDelete }) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: 1.5, display: "flex", flexDirection: "column", flex: 1 }}
    >
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
          {meals.map((meal) => (
            // Loop through each meal and render it inside its own Paper card
            <Paper key={meal.id} variant="outlined" sx={{ p: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {/* Display the meal name with a bullet marker. If name is missing, show a fallback label */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 0,
                  }}
                >
                  <Box
                    aria-hidden="true"
                    sx={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      bgcolor: "text.primary",
                      flex: "0 0 auto",
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ overflowWrap: "anywhere", textAlign: "center" }}
                  >
                    {meal.name || `${title} meal`}
                  </Typography>
                </Box>

                {/* Only show the delete button if onDelete was provided */}
                {onDelete ? (
                  <Button
                    type="button"
                    color="error"
                    size="small"
                    onClick={() => onDelete(meal)}
                    // When clicked, calls onDelete with the specific meal object
                    sx={{ alignSelf: "center" }}
                  >
                    Delete
                  </Button>
                ) : null}
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
}
