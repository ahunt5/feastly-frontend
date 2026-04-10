const STORAGE_KEY = "saved-meal-templates";

function readTemplates() {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return [];
  }
}

function writeTemplates(templates) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

function normalizeIngredients(ingredientsText) {
  return ingredientsText
    .split(",")
    .map((ingredient) => ingredient.trim())
    .filter(Boolean)
    .map((ingredient, index) => ({
      id: `ingredient-${Date.now()}-${index}`,
      name: ingredient,
    }));
}

export function getMealTemplates() {
  return readTemplates();
}

export function createMealTemplate({ name, mealType, ingredientsText }) {
  const templates = readTemplates();

  const template = {
    id: `template-${Date.now()}`,
    name: name.trim(),
    mealType,
    ingredients: normalizeIngredients(ingredientsText),
  };

  const nextTemplates = [template, ...templates];
  writeTemplates(nextTemplates);

  return template;
}

export function updateMealTemplate(templateId, { name, mealType, ingredientsText }) {
  const templates = readTemplates();

  const updatedTemplate = {
    id: templateId,
    name: name.trim(),
    mealType,
    ingredients: normalizeIngredients(ingredientsText),
  };

  const nextTemplates = templates.map((template) =>
    template.id === templateId ? updatedTemplate : template,
  );

  writeTemplates(nextTemplates);

  return updatedTemplate;
}

export function deleteMealTemplate(templateId) {
  const templates = readTemplates().filter((template) => template.id !== templateId);
  writeTemplates(templates);
  return templates;
}
