import { useEffect, useState } from "react";
import "../App.css";

// Hardcoded ingredient data
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
    <div>
      <section>
        <h1>Ingredient Search</h1>
        <p>Search for ingredients from the database and select one.</p>
      </section>

      <section className="ingredient-search-layout">
        <div className="ingredient-search-card">
          <label>Search Ingredients</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIngredient(null);
            }}
            placeholder="Search by ingredient name"
          />

          {isLoading && <p>Loading ingredients...</p>}
          {errorMessage && <p>{errorMessage}</p>}

          {!isLoading && searchTerm && ingredientResults.length === 0 && (
            <p>No ingredients found.</p>
          )}

          {ingredientResults.length > 0 && (
            <div className="ingredient-results">
              {ingredientResults.map((ingredient) => (
                <button
                  key={ingredient.id}
                  onClick={() => handleSelectIngredient(ingredient)}
                >
                  {ingredient.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="ingredient-search-card">
          <h2>Selected Ingredient</h2>

          {!selectedIngredient ? (
            <p>No ingredient selected yet.</p>
          ) : (
            <div>
              <p>
                <strong>Name:</strong> {selectedIngredient.name}
              </p>
              <p>
                <strong>Calories:</strong> {selectedIngredient.calories}
              </p>
              <p>
                <strong>Protein:</strong> {selectedIngredient.protein}
              </p>
              <p>
                <strong>Carbs:</strong> {selectedIngredient.carbs}
              </p>
              <p>
                <strong>Fat:</strong> {selectedIngredient.fat}
              </p>

              <button onClick={handleClearSelection}>Clear Selection</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
