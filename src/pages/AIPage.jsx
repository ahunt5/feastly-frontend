import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { useAuth } from "../auth/AuthContext";
import { generateRecipeSuggestions } from "../services/openAIAPI";

const API = import.meta.env.VITE_API || "/api";
const MAX_INGREDIENTS = 3;

function normalizeOptions(items) {
  return (items ?? [])
    .map((item) => (typeof item === "string" ? item : item?.name ?? ""))
    .filter(Boolean);
}

function formatMacro(value, unit = "") {
  return `${Math.round(Number(value) || 0)}${unit}`;
}

export default function AIPage() {
  const { token } = useAuth();
  const [dietOptions, setDietOptions] = useState([]);
  const [selectedDiets, setSelectedDiets] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDiets() {
      try {
        const response = await fetch(`${API}/filters/diets`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Could not load diet types.");
        }

        setDietOptions(normalizeOptions(data));
      } catch (loadError) {
        setError(loadError.message || "Could not load diet types.");
      } finally {
        setLoadingOptions(false);
      }
    }

    loadDiets();
  }, []);

  const handleAddIngredient = () => {
    const ingredient = ingredientInput.trim();

    if (!ingredient || ingredients.length >= MAX_INGREDIENTS) {
      return;
    }

    if (!ingredients.some((item) => item.toLowerCase() === ingredient.toLowerCase())) {
      setIngredients((current) => [...current, ingredient]);
    }

    setIngredientInput("");
  };

  const handleIngredientKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddIngredient();
    }
  };

  const toggleDiet = (diet) => {
    setSelectedDiets((current) =>
      current.includes(diet)
        ? current.filter((item) => item !== diet)
        : [...current, diet],
    );
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);

    try {
      const recipes = await generateRecipeSuggestions({
        token,
        ingredients,
        diets: selectedDiets,
      });
      setSuggestions(recipes);
    } catch (generateError) {
      setError(generateError.message || "Could not generate recipes.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8f9fb", py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              AI Recipes
            </Typography>
            <Typography color="text.secondary">
              Build meal ideas from your profile and today's nutrition.
            </Typography>
          </Box>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Card variant="outlined">
            <CardContent>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Ingredients
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      label="Ingredient"
                      value={ingredientInput}
                      onChange={(event) => setIngredientInput(event.target.value)}
                      onKeyDown={handleIngredientKeyDown}
                      disabled={ingredients.length >= MAX_INGREDIENTS}
                      fullWidth
                    />
                    <Button
                      type="button"
                      variant="outlined"
                      startIcon={<RestaurantMenuIcon />}
                      onClick={handleAddIngredient}
                      disabled={
                        !ingredientInput.trim() ||
                        ingredients.length >= MAX_INGREDIENTS
                      }
                      sx={{ minHeight: 56, textTransform: "none" }}
                    >
                      Add
                    </Button>
                  </Box>
                  <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                    {ingredients.map((ingredient) => (
                      <Chip
                        key={ingredient}
                        label={ingredient}
                        onDelete={() =>
                          setIngredients((current) =>
                            current.filter((item) => item !== ingredient),
                          )
                        }
                      />
                    ))}
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Diet Types
                  </Typography>
                  {loadingOptions ? (
                    <CircularProgress size={24} />
                  ) : (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {dietOptions.map((diet) => {
                        const selected = selectedDiets.includes(diet);
                        return (
                          <Chip
                            key={diet}
                            label={diet}
                            clickable
                            color={selected ? "primary" : "default"}
                            variant={selected ? "filled" : "outlined"}
                            onClick={() => toggleDiet(diet)}
                          />
                        );
                      })}
                    </Box>
                  )}
                </Box>

                <Box>
                  <Button
                    type="button"
                    variant="contained"
                    startIcon={
                      generating ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : (
                        <AutoAwesomeIcon />
                      )
                    }
                    onClick={handleGenerate}
                    disabled={generating || loadingOptions}
                    sx={{ textTransform: "none" }}
                  >
                    {generating ? "Generating" : "Generate Recipes"}
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {suggestions.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
                gap: 2,
              }}
            >
              {suggestions.map((recipe) => (
                <Card key={recipe.title} variant="outlined">
                  <CardContent>
                    <Stack spacing={2}>
                      <Box>
                        <Chip size="small" label={recipe.mealType} />
                        <Typography variant="h6" fontWeight="bold" mt={1}>
                          {recipe.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {recipe.description}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Nutrition
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatMacro(recipe.estimatedNutrition?.calories)} kcal
                          {" | "}
                          {formatMacro(recipe.estimatedNutrition?.protein, "g")} protein
                          {" | "}
                          {formatMacro(recipe.estimatedNutrition?.carbs, "g")} carbs
                          {" | "}
                          {formatMacro(recipe.estimatedNutrition?.fat, "g")} fat
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Ingredients
                        </Typography>
                        <Stack component="ul" sx={{ pl: 2, my: 0 }} spacing={0.5}>
                          {recipe.ingredients.map((ingredient) => (
                            <Typography
                              key={ingredient}
                              component="li"
                              variant="body2"
                            >
                              {ingredient}
                            </Typography>
                          ))}
                        </Stack>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Instructions
                        </Typography>
                        <Stack component="ol" sx={{ pl: 2, my: 0 }} spacing={0.75}>
                          {recipe.instructions.map((instruction) => (
                            <Typography
                              key={instruction}
                              component="li"
                              variant="body2"
                            >
                              {instruction}
                            </Typography>
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}
