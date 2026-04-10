import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const pickerListSx = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

export default function MealPickerDialog({
  activeDay,
  activeSection,
  meals,
  open,
  onClose,
  onSelectMeal,
}) {
  if (!activeDay || !activeSection) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Select a {activeSection.title} Meal for {activeDay.label}
      </DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ mb: "1rem" }} color="text.secondary">
          {activeDay.shortDate}. {activeSection.description}
        </Typography>
        {/* If no meals exist, render no saved meals yet for this type */}
        {meals.length === 0 ? (
          <Typography>No saved meals yet for this type.</Typography>
        ) : (
          // Otherwise, map all the saved meals of the specified type
          <Box sx={pickerListSx}>
            {meals.map((meal) => (
              <Button
                key={meal.id}
                type="button"
                variant="outlined"
                fullWidth
                onClick={() => onSelectMeal(meal)}
              >
                {/* Make each meal a button, if clicked set the meal as the selected meal */}
                {meal.name || `${activeSection.title} meal`}
              </Button>
            ))}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button type="button" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
