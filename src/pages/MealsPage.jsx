import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { MEAL_SECTIONS } from "../features/mealHelper";
import {
  createMealTemplate,
  deleteMealTemplate,
  getMealTemplates,
  updateMealTemplate,
} from "../features/mealTableApi";

const INITIAL_FORM_DATA = {
  name: "",
  mealType: "breakfast",
  ingredientsText: "",
};

export default function MealsPage() {
  const [templates, setTemplates] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [editingTemplateId, setEditingTemplateId] = useState(null);

  useEffect(() => {
    setTemplates(getMealTemplates());
  }, []);

  const handleOpenDialog = (event) => {
    event.currentTarget.blur();
    requestAnimationFrame(() => {
      setEditingTemplateId(null);
      setFormData(INITIAL_FORM_DATA);
      setIsDialogOpen(true);
    });
  };

  const handleOpenEditDialog = (event, template) => {
    event.currentTarget.blur();
    requestAnimationFrame(() => {
      setEditingTemplateId(template.id);
      setFormData({
        name: template.name,
        mealType: template.mealType,
        ingredientsText: template.ingredients
          .map((ingredient) => ingredient.name)
          .join(", "),
      });
      setIsDialogOpen(true);
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTemplateId(null);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleSaveTemplate = () => {
    if (editingTemplateId) {
      const updatedTemplate = updateMealTemplate(editingTemplateId, formData);

      setTemplates((current) =>
        current.map((template) =>
          template.id === editingTemplateId ? updatedTemplate : template,
        ),
      );
    } else {
      const template = createMealTemplate(formData);
      setTemplates((current) => [template, ...current]);
    }

    handleCloseDialog();
  };

  const handleDeleteTemplate = (templateId) => {
    setTemplates(deleteMealTemplate(templateId));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        py: "3rem",
        px: "1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "70rem",
          gap: "1.5rem",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Typography variant="h4" fontWeight="bold">
            Meals
          </Typography>
          <Typography color="text.secondary">
            Save meals here and reuse them later in your daily log.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1rem",
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              minHeight: "220px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button
              type="button"
              variant="text"
              onClick={handleOpenDialog}
              sx={{
                fontSize: "4rem",
                minWidth: 0,
                lineHeight: 1,
              }}
            >
              +
            </Button>
          </Paper>

          {templates.map((template) => (
            <Paper
              key={template.id}
              variant="outlined"
              sx={{
                p: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
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
                  ? template.ingredients.map((ingredient) => ingredient.name).join(", ")
                  : "None"}
              </Typography>

              <Button
                type="button"
                onClick={(event) => handleOpenEditDialog(event, template)}
              >
                Edit
              </Button>

              <Button
                type="button"
                color="error"
                onClick={() => handleDeleteTemplate(template.id)}
              >
                Delete
              </Button>
            </Paper>
          ))}
        </Box>

        <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
          <DialogTitle>
            {editingTemplateId ? "Edit Meal Template" : "Create Meal Template"}
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem", pt: "0.25rem" }}>
              <TextField
                label="Meal Name"
                value={formData.name}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                placeholder="Chicken avocado and 2 eggs"
                fullWidth
              />

              <TextField
                select
                label="Meal Type"
                value={formData.mealType}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    mealType: event.target.value,
                  }))
                }
                fullWidth
              >
                {MEAL_SECTIONS.map((section) => (
                  <MenuItem key={section.key} value={section.key}>
                    {section.title}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Ingredients"
                value={formData.ingredientsText}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    ingredientsText: event.target.value,
                  }))
                }
                placeholder="Chicken, avocado, eggs"
                fullWidth
                multiline
                minRows={3}
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
              onClick={handleSaveTemplate}
              disabled={!formData.name.trim()}
            >
              {editingTemplateId ? "Save Changes" : "Save Meal"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}
