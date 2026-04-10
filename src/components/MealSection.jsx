import { Box, Button, Paper, Typography } from "@mui/material";

export default function MealSection({ title, meals, onAdd, onDelete }) {
  return (
    <Paper variant="outlined" sx={{ p: "0.75rem" }}>
      <Typography variant="subtitle1" fontWeight="bold">
        {title}
      </Typography>
      {/* Add meal button */}
      <Button type="button" variant="outlined" size="small" onClick={onAdd}>
        Add {title}
      </Button>
      {/* If no meals exist yet, display 'No items' */}
      {meals.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: "0.5rem" }}
        >
          No items yet
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            mt: "0.5rem",
          }}
        >
          {/* Display meals if the user has meals */}
          {meals.map((meal, index) => (
            <Paper key={meal.id} variant="outlined" sx={{ p: "0.5rem" }}>
              <Typography variant="body2">
                {index + 1}. {meal.name || `${title} meal`}
              </Typography>

              {meal.ingredients?.length ? (
                <Typography variant="caption" color="text.secondary">
                  Ingredients:{" "}
                  {meal.ingredients
                    .map((ingredient) => ingredient.name)
                    .join(", ")}
                </Typography>
              ) : null}
              {/* Deletion button */}
              {onDelete ? (
                <Button
                  type="button"
                  color="error"
                  size="small"
                  onClick={() => onDelete(meal)}
                  sx={{ mt: "0.5rem" }}
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
