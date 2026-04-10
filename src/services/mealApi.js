/* ========================================
   MEAL API FILE
   ========================================

   PURPOSE:
   This file handles communication between the frontend
   and the backend API for meals.

   WHAT THIS FILE DOES:
   - Creates one reusable request helper function
   - Converts meal type names between frontend and backend formats
   - Normalizes meal data into one consistent shape
   - Fetches meals from the backend
   - Creates a new meal
   - Deletes a meal

   WHY THIS FILE IS USEFUL:
   - Keeps API logic separate from UI components
   - Avoids repeating fetch code in many places
   - Makes frontend data consistent even if backend field names vary
======================================== */

/* Stores the base API route prefix so every request starts with "/api" */
const API_PREFIX = "/api";

/* 
   Reusable helper function for all API requests.
   It takes:
   - path: the endpoint like "/meals"
   - options: fetch settings like method, headers, and body
*/
async function apiRequest(path, options = {}) {
  /* Sends the HTTP request using fetch */
  const response = await fetch(`${API_PREFIX}${path}`, {
    ...options, // keeps any options passed into the function, such as method or body
    headers: {
      "Content-Type": "application/json", // tells the server we are sending JSON data
      ...(options.headers ?? {}), // adds extra headers like Authorization if they exist
    },
  });

  /* Reads the raw response body as text first */
  const text = await response.text();

  /* Starts with an empty object in case the response body is empty */
  let data = {};

  /* Only try to parse the response if text exists */
  if (text) {
    try {
      /* Tries to convert the response text into a JavaScript object */
      data = JSON.parse(text);
    } catch {
      /* If response is not valid JSON, store it as a message string instead */
      data = { message: text };
    }
  }

  /* If the HTTP response status is not successful, throw an error */
  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Meal request failed.");
  }

  /* Returns the parsed response data */
  return data;
}

/* 
   Converts meal type names from frontend format to backend format.
   Example:
   - frontend uses "snacks"
   - backend expects "snack"
*/
const UI_TO_API_MEAL_TYPE = {
  breakfast: "breakfast", // same in frontend and backend
  lunch: "lunch", // same in frontend and backend
  dinner: "dinner", // same in frontend and backend
  snacks: "snack", // frontend plural becomes backend singular
};

/* 
   Converts meal type names from backend format to frontend format.
   Example:
   - backend returns "snack"
   - frontend wants "snacks"
*/
const API_TO_UI_MEAL_TYPE = {
  breakfast: "breakfast", // same in backend and frontend
  lunch: "lunch", // same in backend and frontend
  dinner: "dinner", // same in backend and frontend
  snack: "snacks", // backend singular becomes frontend plural
};

/* 
   Converts a frontend meal type into the backend version.
   If the meal type is not found in the object, it just returns the original value.
*/
export function toApiMealType(mealType) {
  return UI_TO_API_MEAL_TYPE[mealType] ?? mealType;
}

/* 
   Converts a backend meal type into the frontend version.
   If the meal type is not found in the object, it just returns the original value.
*/
export function toUiMealType(mealType) {
  return API_TO_UI_MEAL_TYPE[mealType] ?? mealType;
}

/* 
   Normalizes a meal object so the frontend always receives a consistent format.
   This helps when backend field names may vary, such as:
   - meal_date or mealDate
   - meal_type or mealType
*/
function normalizeMeal(meal) {
  /* Gets the raw date from either snake_case or camelCase field name */
  const rawDate = meal.meal_date ?? meal.mealDate ?? null;

  /* 
     If rawDate is a string like "2026-03-25T00:00:00.000Z",
     split it at "T" and keep only the date part.
     Otherwise return it as is.
  */
  const normalizedDate =
    typeof rawDate === "string" ? rawDate.split("T")[0] : rawDate;

  /* Returns a cleaned-up meal object in one consistent frontend shape */
  return {
    id: meal.id, // keeps the meal id
    name: meal.name || "", // uses the meal name or empty string if missing
    mealDate: normalizedDate, // uses normalized date value
    mealType: toUiMealType(meal.meal_type ?? meal.mealType), // converts backend meal type into frontend meal type
    ingredients: Array.isArray(meal.ingredients) ? meal.ingredients : [], // ensures ingredients is always an array
  };
}

/* 
   Fetches all meals for the logged-in user.
   Requires a token for authorization.
*/
export async function fetchMeals(token) {
  /* Sends a GET request to /api/meals */
  const meals = await apiRequest("/meals", {
    method: "GET", // GET is used to retrieve data
    headers: {
      Authorization: `Bearer ${token}`, // sends the token so the backend knows which user is making the request
    },
  });

  /* If the server does not return an array, return an empty array instead */
  if (!Array.isArray(meals)) return [];

  /* Normalizes every meal before returning them to the frontend */
  return meals.map(normalizeMeal);
}

/* 
   Creates a new meal in the backend.
   It expects:
   - mealDate
   - mealType
   - token
*/
export async function createMeal({ mealDate, mealType, token }) {
  /* Sends a POST request to /api/meals */
  const meal = await apiRequest("/meals", {
    method: "POST", // POST is used to create new data
    headers: {
      Authorization: `Bearer ${token}`, // sends user token for authentication
    },
    body: JSON.stringify({
      mealDate, // sends the selected meal date
      mealType: toApiMealType(mealType), // converts frontend meal type into backend format before sending
    }),
  });

  /* Returns the created meal in normalized frontend format */
  return normalizeMeal(meal);
}

/* 
   Deletes a meal by id.
   Requires:
   - id of the meal
   - token for authorization
*/
export async function deleteMeal(id, token) {
  /* Sends a DELETE request to /api/meals/:id */
  return apiRequest(`/meals/${id}`, {
    method: "DELETE", // DELETE is used to remove data
    headers: {
      Authorization: `Bearer ${token}`, // sends token so backend can verify the user
    },
  });
}
