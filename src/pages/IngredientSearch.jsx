import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

// Mock data
const MOCK_INGREDIENTS = [
  {
    id: 1,
    name: "Chicken Breast",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
  },
  { id: 2, name: "Rice", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { id: 3, name: "Broccoli", calories: 55, protein: 3.7, carbs: 11, fat: 0.6 },
  { id: 4, name: "Salmon", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { id: 5, name: "Egg", calories: 78, protein: 6, carbs: 1, fat: 5 },
];

export default function IngredientSearchPage() {
  console.log("DailyTotalsPage rendered");
  const [searchTerm, setSearchTerm] = useState("");
  const [ingredientResults, setIngredientResults] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();

    if (!trimmedSearchTerm) {
      setIngredientResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSearchIngredients(trimmedSearchTerm);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleSearchIngredients = (query) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const results = MOCK_INGREDIENTS.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(query),
      );

      setIngredientResults(results);
    } catch (error) {
      console.error("Error searching ingredients:", error);
      setIngredientResults([]);
      setErrorMessage("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectIngredient = (ingredient) => {
    setSelectedIngredient(ingredient);
    setSearchTerm(ingredient.name);
    setIngredientResults([]);
  };

  const handleClearSelection = () => {
    setSelectedIngredient(null);
    setSearchTerm("");
    setIngredientResults([]);
    setErrorMessage("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: 2,
        py: 4,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: "70rem" }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography variant="h4" fontWeight="bold">
            Ingredient Search
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Search for ingredients and view nutrition details.
          </Typography>
        </Box>

        {/* Layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 3,
          }}
        >
          {/* Search Card */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Search Ingredients
            </Typography>

            <TextField
              label="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedIngredient(null);
              }}
              placeholder="Search by ingredient name"
              fullWidth
            />

            {isLoading && (
              <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
                <CircularProgress />
              </Box>
            )}

            {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

            {!isLoading &&
              searchTerm &&
              ingredientResults.length === 0 &&
              !selectedIngredient && (
                <Typography color="text.secondary">
                  No ingredients found.
                </Typography>
              )}

            {ingredientResults.length > 0 && (
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  maxHeight: 300,
                  overflowY: "auto",
                }}
              >
                <List disablePadding>
                  {ingredientResults.map((ingredient) => (
                    <ListItemButton
                      key={ingredient.id}
                      onClick={() => handleSelectIngredient(ingredient)}
                    >
                      <ListItemText primary={ingredient.name} />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
            )}
          </Paper>

          {/* Selected Ingredient */}
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Selected Ingredient
            </Typography>

            {!selectedIngredient ? (
              <Typography color="text.secondary">
                No ingredient selected yet.
              </Typography>
            ) : (
              <>
                {/* Name */}
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    backgroundColor: "#f8fafc",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {selectedIngredient.name}
                  </Typography>
                </Paper>

                {/* Macro Cards */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 2,
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: "#e3f2fd",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="subtitle2">Calories</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedIngredient.calories}
                    </Typography>
                  </Paper>

                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: "#e8f5e9",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="subtitle2">Protein</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedIngredient.protein}g
                    </Typography>
                  </Paper>

                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: "#fff3e0",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="subtitle2">Carbs</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedIngredient.carbs}g
                    </Typography>
                  </Paper>

                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: "#fce4ec",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="subtitle2">Fat</Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {selectedIngredient.fat}g
                    </Typography>
                  </Paper>
                </Box>

                <Button variant="outlined" onClick={handleClearSelection}>
                  Clear Selection
                </Button>
              </>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
