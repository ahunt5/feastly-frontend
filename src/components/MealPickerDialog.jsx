// Importing Material UI components used to build the dialog UI,
// including layout containers, buttons, text, and dialog structure.
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

// A reusable style object that arranges the meal buttons in a vertical column
// with spacing between them.
const pickerListSx = {
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
};

// Main component that displays a dialog allowing the user to pick a meal.
// It receives props describing the active day, active meal section,
// available meals, dialog visibility, and callback functions.
export default function MealPickerDialog({
  activeDay,
  activeSection,
  meals,
  open,
  onClose,
  onSelectMeal,
}) {
  // If no day or section is selected, the dialog should not render at all.
  if (!activeDay || !activeSection) {
    return null;
  }

  // The dialog UI begins here. It opens or closes based on the `open` prop.
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* The title of the dialog, showing which meal type and day the user is selecting for */}
      <DialogTitle>
        Select a {activeSection.title} Meal for {activeDay.label}
      </DialogTitle>

      {/* The scrollable content area of the dialog, with a divider line */}
      <DialogContent dividers>
        {/* Displays the date and a description of the meal section */}
        <Typography sx={{ mb: "1rem" }} color="text.secondary">
          {activeDay.shortDate}. {activeSection.description}
        </Typography>

        {/* If there are no saved meals, show a fallback message */}
        {!meals || meals.length === 0 ? (
          <Typography>No saved meals yet for this type.</Typography>
        ) : (
          // Otherwise, show a list of selectable meal buttons
          <Box sx={pickerListSx}>
            {meals.map((meal) => (
              // Each button represents one saved meal option
              <Button
                key={meal.id} // Unique key for React rendering
                type="button"
                variant="outlined"
                fullWidth
                onClick={() => onSelectMeal(meal)} // Sends selected meal back to parent
              >
                {/* Make each meal a button, if clicked set the meal as the selected meal */}
                {meal.name || `${activeSection.title} meal`}
                {/* Shows the meal name or a fallback label */}
              </Button>
            ))}
          </Box>
        )}
      </DialogContent>

      {/* Footer area containing the Close button */}
      <DialogActions>
        <Button type="button" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
