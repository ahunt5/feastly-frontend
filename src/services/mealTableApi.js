// Import two helper functions that convert meal types between API format and UI format
import { toApiMealType, toUiMealType } from "./mealApi";

// Define a constant prefix for all API endpoints
const API_PREFIX = "/api";

// Define a reusable async function to make API requests
async function apiRequest(path, options = {}) {
  // Send a fetch request to the API using the prefix and provided path
  const response = await fetch(`${API_PREFIX}${path}`, {
    // Spread any custom options passed into the function
    ...options,
    // Ensure we always send JSON from the client
    headers: {
      "Content-Type": "application/json",
      // Merge any custom headers, if they exist
      ...(options.headers ?? {}),
    },
  });

  // Read the raw response body as text
  const text = await response.text();
  // Initialize an empty object to hold parsed data
  let data = {};

  // Only try to parse if there is a response body
  if (text) {
    try {
      // Try to parse the response text as JSON
      data = JSON.parse(text);
    } catch {
      // If parsing fails, treat the text as a simple message
      data = { message: text };
    }
  }

  // If the HTTP status is not in the 200–299 range, treat it as an error
  if (!response.ok) {
    // Throw an error with the best available message from the response
    throw new Error(
      data?.message || data?.error || "Saved meal request failed.",
    );
  }

  // Return the parsed data for successful responses
  return data;
}

// Normalize the ingredients field into a consistent array of objects
function normalizeIngredients(ingredients) {
  // If ingredients is not an array, return an empty array
  if (!Array.isArray(ingredients)) {
    return [];
  }

  // Map over each ingredient and ensure it is an object with id and name
  return ingredients.map((ingredient, index) =>
    // If the ingredient is a string, convert it into an object
    typeof ingredient === "string"
      ? { id: `ingredient-${index}`, name: ingredient }
      : // If it is already an object, leave it as is
        ingredient,
  );
}

// Normalize a template object into a consistent shape for the UI
function normalizeTemplate(template) {
  // Return a new template object with normalized fields
  return {
    // Copy all existing properties from the original template
    ...template,
    // Normalize mealType using multiple possible API field names
    mealType: toUiMealType(
      template.meal_type ?? template.mealType ?? template.type,
    ),
    // Normalize ingredients into a consistent array of objects
    ingredients: normalizeIngredients(template.ingredients ?? []),
  };
}

// Fetch all meal templates for the current user
export async function getMealTemplates(token) {
  // Call the API to get saved meals, passing the auth token
  const templates = await apiRequest("/savedMeals", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Normalize each template before returning them
  return templates.map(normalizeTemplate);
}

// Create a new meal template on the server
export async function createMealTemplate(
  { name, mealType, ingredients },
  token,
) {
  // Send a POST request to create a new saved meal
  const template = await apiRequest("/savedMeals", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Send the template data as JSON, converting mealType to API format
    body: JSON.stringify({
      name: name.trim(),
      mealType: toApiMealType(mealType),
      ingredients,
    }),
  });

  // Normalize and return the created template
  return normalizeTemplate(template);
}

// Update an existing meal template on the server
export async function updateMealTemplate(
  templateId,
  { name, mealType, ingredients },
  token,
) {
  // Send a PUT request to update a specific saved meal by ID
  const template = await apiRequest(`/savedMeals/${templateId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Send the updated template data as JSON
    body: JSON.stringify({
      name: name.trim(),
      mealType: toApiMealType(mealType),
      ingredients,
    }),
  });

  // Normalize and return the updated template
  return normalizeTemplate(template);
}

// Delete a meal template by its ID
export async function deleteMealTemplate(templateId, token) {
  // Send a DELETE request for the specific template
  await apiRequest(`/savedMeals/${templateId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Create a real meal instance from a saved template
export async function createMealFromTemplate(
  templateId,
  mealDate,
  mealType,
  token,
) {
  // Send a POST request to "use" a template and create a meal
  const meal = await apiRequest(`/savedMeals/${templateId}/use`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Send the date and meal type (converted to API format) as JSON
    body: JSON.stringify({
      mealDate,
      mealType: toApiMealType(mealType),
    }),
  });

  // Return a normalized meal object for the UI
  return {
    // Copy all properties from the API meal object
    ...meal,
    // Normalize the mealType field for the UI
    mealType: toUiMealType(meal.meal_type ?? meal.mealType),
    // Normalize the ingredients field
    ingredients: normalizeIngredients(meal.ingredients ?? []),
  };
}
