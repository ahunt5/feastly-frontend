/*
========================================
MealsPage Component
========================================
PURPOSE:
This page lets the user create, edit, view, and delete reusable meal templates.

WHAT IT DOES:
- Loads saved meal templates from the backend
- Loads ingredient options from the backend
- Opens a dialog to create or edit a meal template
- Lets the user search and add ingredients
- Lets the user adjust ingredient quantities
- Saves the meal template to the database
- Deletes meal templates from the database

MAIN IDEAS TO EXPLAIN IN CLASS:
1. useState stores page data and form data
2. useEffect loads templates and ingredients when the page opens
3. One dialog is reused for both "create" and "edit"
4. Form data is stored in one object for easier updates
5. The page renders meal cards dynamically using map()
========================================
*/

import { useEffect, useState } from "react"; /// Imports React hooks: useState for state, useEffect for side effects like fetching data
import {
  Alert, // Shows error messages in a styled alert box
  Autocomplete, // Searchable dropdown for ingredient selection
  Box, // MUI layout wrapper for flex/grid/styling
  Button, // MUI button component
  Dialog, // Modal popup window
  DialogActions, // Section at bottom of dialog for action buttons
  DialogContent, // Main content area inside dialog
  DialogTitle, // Title area of dialog
  MenuItem, // Dropdown option item for select fields
  Paper, // Card-like container
  TextField, // Input field component
  Typography, // Text display component
} from "@mui/material";
import { useAuth } from "../auth/AuthContext"; // Custom hook to access authentication data like token
import { fetchIngredients } from "../services/ingredientApi"; // API function to load all ingredients
import { MEAL_SECTIONS } from "../services/mealHelper"; // Constant list of meal section options like breakfast/lunch/dinner
import {
  createMealTemplate, // API function to create a new meal template
  deleteMealTemplate, // API function to delete a meal template
  getMealTemplates, // API function to fetch all meal templates
  updateMealTemplate, // API function to update an existing meal template
} from "../services/mealTableApi";

/*
This object is the default form state.
It is used when:
- the dialog first opens for a new meal
- the form is reset after closing
*/
const INITIAL_FORM_DATA = {
  name: "", // Stores the meal name typed by the user
  mealType: "breakfast", // Default meal type when creating a new template
  ingredientSearch: null, // Stores the currently selected autocomplete value
  ingredients: [], // Stores selected ingredients with their quantities
};

export default function MealsPage() {
  const { token } = useAuth(); // Gets the logged-in user's token so API requests can be authenticated

  // Stores all saved meal templates that appear as cards on the page
  const [templates, setTemplates] = useState([]);

  // Stores all available ingredients used by the autocomplete search
  const [ingredients, setIngredients] = useState([]);

  // Controls whether the create/edit dialog is open
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Stores all form values for the dialog in one object
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  // If this has an id, the dialog is editing an existing template
  // If it is null, the dialog is creating a new template
  const [editingTemplateId, setEditingTemplateId] = useState(null);

  // Stores any error message from loading, saving, or deleting
  const [error, setError] = useState(null);

  /*
  useEffect runs when the component mounts
  and whenever the token changes.

  PURPOSE:
  - Load meal templates from backend
  - Load ingredients from backend
  */
  useEffect(() => {
    async function loadPageData() {
      // If there is no token, stop because we cannot make authenticated requests
      if (!token) {
        return;
      }

      try {
        // Promise.all runs both API requests at the same time for better performance
        const [nextTemplates, nextIngredients] = await Promise.all([
          getMealTemplates(token), // Fetch saved meal templates
          fetchIngredients(token), // Fetch all ingredients
        ]);

        setTemplates(nextTemplates); // Save meal templates into state
        setIngredients(nextIngredients); // Save ingredients into state
        setError(null); // Clear old errors if loading succeeds
      } catch (loadError) {
        // If loading fails, show an error message
        setError(loadError.message || "Could not load meals page data.");
      }
    }

    loadPageData(); // Call the async loader function
  }, [token]); // Effect runs again only if token changes

  /*
  Opens the dialog in CREATE mode.
  Steps:
  1. Removes focus from the clicked button
  2. Clears editing id
  3. Resets form to blank/default values
  4. Opens dialog
  */
  const handleOpenDialog = (event) => {
    event.currentTarget.blur(); // Removes focus from the button to avoid accessibility/focus issues
    requestAnimationFrame(() => {
      setEditingTemplateId(null); // Null means we are creating a new template
      setFormData(INITIAL_FORM_DATA); // Reset form to default values
      setIsDialogOpen(true); // Open the dialog
    });
  };

  /*
  Opens the dialog in EDIT mode.
  Steps:
  1. Removes focus from clicked button
  2. Stores the template id being edited
  3. Fills the form with that template's existing data
  4. Opens dialog
  */
  const handleOpenEditDialog = (event, template) => {
    event.currentTarget.blur(); // Removes focus from the button for cleaner dialog behavior
    requestAnimationFrame(() => {
      setEditingTemplateId(template.id); // Save template id so we know we are editing this item
      setFormData({
        name: template.name, // Pre-fill meal name
        mealType: template.mealType, // Pre-fill meal type
        ingredientSearch: null, // Reset autocomplete search field
        ingredients: template.ingredients.map((ingredient) => ({
          ingredientId: ingredient.id, // Save ingredient id in the form structure
          name: ingredient.name, // Save ingredient name for display
          quantity: ingredient.quantity ?? 1, // Use saved quantity, or default to 1 if missing
        })),
      });
      setIsDialogOpen(true); // Open the dialog
    });
  };

  /*
  Closes the dialog and resets related state.
  */
  const handleCloseDialog = () => {
    setIsDialogOpen(false); // Close dialog
    setEditingTemplateId(null); // Clear edit mode
    setFormData(INITIAL_FORM_DATA); // Reset form to default values
  };

  /*
  Saves the meal template.
  This function handles BOTH:
  - creating a new template
  - updating an existing template

  It first builds the payload in the format the API expects.
  */
  const handleSaveTemplate = async () => {
    const payload = {
      name: formData.name, // Meal name to send to backend
      mealType: formData.mealType, // Meal type to send to backend
      ingredients: formData.ingredients.map((ingredient) => ({
        ingredientId: ingredient.ingredientId, // Ingredient id expected by backend
        quantity: Number(ingredient.quantity), // Convert quantity to a number before sending
      })),
    };

    try {
      // If editingTemplateId exists, update existing template
      if (editingTemplateId) {
        const updatedTemplate = await updateMealTemplate(
          editingTemplateId, // Which template to update
          payload, // New data to save
          token, // Auth token
        );

        // Replace the old template in state with the updated one
        setTemplates((current) =>
          current.map((template) =>
            template.id === editingTemplateId ? updatedTemplate : template,
          ),
        );
      } else {
        // Otherwise create a brand new template
        const template = await createMealTemplate(payload, token);

        // Add the new template to the beginning of the templates array
        setTemplates((current) => [template, ...current]);
      }

      setError(null); // Clear any old errors if save succeeds
      handleCloseDialog(); // Close and reset the dialog after saving
    } catch (saveError) {
      // Show error if save fails
      setError(saveError.message || "Could not save meal template.");
    }
  };

  /*
  Deletes a meal template by id.
  */
  const handleDeleteTemplate = async (templateId) => {
    try {
      await deleteMealTemplate(templateId, token); // Delete template from backend

      // Remove the deleted template from local state
      setTemplates((current) =>
        current.filter((template) => template.id !== templateId),
      );

      setError(null); // Clear error if delete succeeds
    } catch (deleteError) {
      // Show error if delete fails
      setError(deleteError.message || "Could not delete meal template.");
    }
  };

  /*
  Runs when user selects an ingredient from autocomplete.

  Logic:
  - If no ingredient was selected, do nothing
  - If ingredient is already in the list, do not add duplicate
  - Otherwise add it to formData.ingredients with default quantity 1
  */
  const handleSelectIngredient = (_, ingredient) => {
    if (!ingredient) {
      return; // Stop if selection is empty
    }

    setFormData((current) => {
      const alreadySelected = current.ingredients.some(
        (selected) => selected.ingredientId === ingredient.id,
      ); // Checks if ingredient is already added

      if (alreadySelected) {
        return { ...current, ingredientSearch: null }; // Reset search field but do not duplicate ingredient
      }

      return {
        ...current, // Keep all other form data
        ingredientSearch: null, // Clear autocomplete after selection
        ingredients: [
          ...current.ingredients, // Keep existing selected ingredients
          {
            ingredientId: ingredient.id, // Add selected ingredient id
            name: ingredient.name, // Add selected ingredient name
            quantity: 1, // Start with quantity 1
          },
        ],
      };
    });
  };

  /*
  Updates the quantity of one selected ingredient.
  */
  const handleIngredientQuantityChange = (ingredientId, quantity) => {
    setFormData((current) => ({
      ...current, // Keep other form fields unchanged
      ingredients: current.ingredients.map(
        (ingredient) =>
          ingredient.ingredientId === ingredientId
            ? { ...ingredient, quantity } // Update only the matching ingredient
            : ingredient, // Leave other ingredients unchanged
      ),
    }));
  };

  /*
  Removes one ingredient from the selected ingredients list.
  */
  const handleRemoveIngredient = (ingredientId) => {
    setFormData((current) => ({
      ...current, // Keep other form fields unchanged
      ingredients: current.ingredients.filter(
        (ingredient) => ingredient.ingredientId !== ingredientId, // Keep all ingredients except the one being removed
      ),
    }));
  };

  /*
  JSX RETURN:
  This is the UI shown on the screen.
  It includes:
  - Page wrapper
  - Header
  - Error message
  - Add new meal card
  - Existing meal template cards
  - Dialog for creating/editing meal templates
  */
  return (
    <Box
      sx={{
        display: "flex", // Uses flexbox for layout
        justifyContent: "center", // Centers content horizontally
        alignItems: "flex-start", // Aligns content to the top vertically
        minHeight: "100vh", // Makes page take full viewport height
        py: "3rem", // Vertical padding
        px: "1rem", // Horizontal padding
      }}
    >
      <Box
        sx={{
          display: "flex", // Flex layout
          flexDirection: "column", // Stack children vertically
          width: "100%", // Full available width
          maxWidth: "70rem", // Prevent content from getting too wide
          gap: "1.5rem", // Space between sections
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Typography variant="h4" fontWeight="bold">
            Meals
          </Typography>
          <Typography color="text.secondary">
            Save meals here and reuse them later in your daily log.
          </Typography>

          {/* Show error alert only if error exists */}
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Box>

        <Box
          sx={{
            display: "grid", // Uses CSS grid for meal cards
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", // Responsive columns
            gap: "1rem", // Space between cards
          }}
        >
          {/* This first card is the "add new meal" card */}
          <Paper
            variant="outlined"
            sx={{
              minHeight: "220px", // Gives card fixed visual height
              display: "flex", // Centers button with flexbox
              alignItems: "center", // Vertical center
              justifyContent: "center", // Horizontal center
            }}
          >
            <Button
              type="button"
              variant="text"
              onClick={handleOpenDialog} // Opens create dialog
              sx={{
                fontSize: "4rem", // Makes plus sign large
                minWidth: 0, // Prevents unnecessary button width
                lineHeight: 1, // Keeps plus symbol visually centered
              }}
            >
              +
            </Button>
          </Paper>

          {/* Loop through templates and create one card per template */}
          {templates.map((template) => (
            <Paper
              key={template.id} // Unique key helps React track list items
              variant="outlined"
              sx={{
                p: "1rem", // Inner padding
                display: "flex", // Flex layout inside card
                flexDirection: "column", // Stack content vertically
                gap: "0.75rem", // Space between items in card
              }}
            >
              <Box>
                <Typography variant="h6">{template.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {template.mealType}
                </Typography>
              </Box>

              <Typography variant="body2">
                Ingredients:{" "}
                {template.ingredients.length > 0
                  ? template.ingredients
                      .map(
                        (ingredient) =>
                          `${ingredient.name} (${ingredient.quantity ?? 1})`, // Formats each ingredient as name(quantity)
                      )
                      .join(", ") // Joins all ingredients into one string
                  : "None"}{" "}
                {/* If no ingredients exist, show "None" */}
              </Typography>

              <Button
                type="button"
                onClick={(event) => handleOpenEditDialog(event, template)} // Opens dialog pre-filled for editing
              >
                Edit
              </Button>

              <Button
                type="button"
                color="error"
                onClick={() => handleDeleteTemplate(template.id)} // Deletes selected template
              >
                Delete
              </Button>
            </Paper>
          ))}
        </Box>

        {/* Dialog used for both creating and editing meal templates */}
        <Dialog
          open={isDialogOpen} // Controls whether dialog is visible
          onClose={handleCloseDialog} // Closes dialog when user clicks outside or presses escape
          fullWidth // Makes dialog use available width
          maxWidth="sm" // Limits maximum width to small
        >
          <DialogTitle>
            {editingTemplateId ? "Edit Meal Template" : "Create Meal Template"}
          </DialogTitle>

          <DialogContent dividers>
            <Box
              sx={{
                display: "flex", // Stack form fields vertically
                flexDirection: "column",
                gap: "1rem", // Space between form fields
                pt: "0.25rem", // Small top padding
              }}
            >
              <TextField
                label="Meal Name"
                value={formData.name} // Controlled input tied to state
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current, // Keep rest of formData
                    name: event.target.value, // Update meal name
                  }))
                }
                placeholder="Chicken avocado and 2 eggs"
                fullWidth
              />

              <TextField
                select // Makes this field behave like a dropdown
                label="Meal Type"
                value={formData.mealType} // Controlled dropdown value
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current, // Keep other form values
                    mealType: event.target.value, // Update meal type
                  }))
                }
                fullWidth
              >
                {/* Render dropdown options from helper constant */}
                {MEAL_SECTIONS.map((section) => (
                  <MenuItem key={section.key} value={section.key}>
                    {section.title}
                  </MenuItem>
                ))}
              </TextField>

              <Autocomplete
                options={ingredients} // Ingredient choices loaded from backend
                value={formData.ingredientSearch} // Current selected autocomplete value
                onChange={handleSelectIngredient} // Handles adding ingredient
                getOptionLabel={(option) => option.name ?? ""} // Shows ingredient name in dropdown
                isOptionEqualToValue={(option, value) => option.id === value.id} // Tells autocomplete how to compare objects
                renderInput={(params) => (
                  <TextField
                    {...params} // Passes MUI autocomplete props into the text field
                    label="Search Ingredients"
                    placeholder="Search and add ingredients"
                  />
                )}
              />

              {/* Display each selected ingredient with quantity input and remove button */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {formData.ingredients.map((ingredient) => (
                  <Box
                    key={ingredient.ingredientId} // Unique key for each selected ingredient row
                    sx={{
                      display: "grid", // Grid layout for name, quantity, and remove button
                      gridTemplateColumns: "1fr 120px auto",
                      gap: "0.75rem",
                      alignItems: "center",
                    }}
                  >
                    <Typography>{ingredient.name}</Typography>

                    <TextField
                      label="Quantity"
                      type="number" // Number input for quantity
                      value={ingredient.quantity} // Controlled value from state
                      onChange={(event) =>
                        handleIngredientQuantityChange(
                          ingredient.ingredientId, // Which ingredient to update
                          Number(event.target.value), // New numeric quantity
                        )
                      }
                      inputProps={{ min: 1 }} // Prevents values below 1
                      fullWidth
                    />

                    <Button
                      type="button"
                      color="error"
                      onClick={() =>
                        handleRemoveIngredient(ingredient.ingredientId)
                      } // Removes selected ingredient
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
              </Box>

              {/* Read-only summary of selected ingredients */}
              <TextField
                label="Selected Ingredients"
                value={formData.ingredients
                  .map(
                    (ingredient) =>
                      `${ingredient.name} (${ingredient.quantity})`, // Converts ingredient objects to summary text
                  )
                  .join(", ")} // Joins them into one string
                onChange={() =>
                  setFormData((current) => ({
                    ...current,
                    ingredients: current.ingredients, // Does not really change anything because field is disabled
                  }))
                }
                fullWidth
                multiline // Allows multi-line display
                minRows={2} // Minimum visible height
                disabled // Makes it read-only
              />
            </Box>
          </DialogContent>

          <DialogActions>
            <Button type="button" onClick={handleCloseDialog}>
              Cancel
            </Button>

            <Button
              type="button"
              variant="contained"
              onClick={handleSaveTemplate} // Saves meal template
              disabled={
                !formData.name.trim() || formData.ingredients.length === 0
              } // Disable save if name is empty or no ingredients selected
            >
              {editingTemplateId ? "Save Changes" : "Save Meal"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
