import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Slider,
  Stack,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Snackbar,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#D85A30" },
    secondary: { main: "#1D9E75" },
    background: { default: "#FAFAF8", paper: "#ffffff" },
  },
  typography: {
    fontFamily: "'Georgia', serif",
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700, fontSize: "1rem" },
    body2: { fontFamily: "system-ui, sans-serif" },
    caption: { fontFamily: "system-ui, sans-serif" },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { border: "1px solid #E8E6DF", boxShadow: "none" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: "system-ui, sans-serif", fontWeight: 500 },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          fontFamily: "system-ui, sans-serif",
          fontSize: 13,
          textTransform: "none",
          borderColor: "#E8E6DF",
          color: "#5F5E5A",
          "&.Mui-selected": {
            backgroundColor: "#2C2C2A",
            color: "#fff",
            "&:hover": { backgroundColor: "#444441" },
          },
        },
      },
    },
  },
});

const API = import.meta.env.VITE_API || "/api";

const DEFAULT_MACROS = {
  calories: 2000,
  protein: 100,
  carbs: 250,
  fat: 70,
};

async function parseResponse(response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(data, fallback) {
  if (typeof data === "string") return data;
  return data?.message || data?.error || fallback;
}

function normalize(arr) {
  return (arr ?? [])
    .map((x) =>
      typeof x === "string"
        ? x
        : x?.name || x?.label || x?.title || x?.value || "",
    )
    .filter(Boolean);
}

async function fetchRequired(url, options, label) {
  const response = await fetch(url, options);
  const data = await parseResponse(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data, `Failed to load ${label}.`));
  }

  return data;
}

async function fetchOptional(url, options, fallback, label) {
  const response = await fetch(url, options);
  const data = await parseResponse(response);

  if (response.status === 204 || response.status === 404) {
    return fallback;
  }

  if (!response.ok) {
    throw new Error(getErrorMessage(data, `Failed to load ${label}.`));
  }

  return data ?? fallback;
}

async function savePreference(url, body, headers) {
  const request = (method) =>
    fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });

  const response = await request("PUT");

  if (response.status === 404 || response.status === 405) {
    return request("POST");
  }

  return response;
}

function getUserIdFromToken(token) {
  if (!token) return null;

  try {
    return JSON.parse(atob(token.split(".")[1])).id;
  } catch {
    return null;
  }
}

const MACROS = [
  {
    key: "calories",
    label: "Calories",
    unit: "kcal",
    min: 1200,
    max: 4000,
    step: 50,
    color: "#D85A30",
  },
  {
    key: "protein",
    label: "Protein",
    unit: "g",
    min: 20,
    max: 300,
    step: 5,
    color: "#1D9E75",
  },
  {
    key: "carbs",
    label: "Carbs",
    unit: "g",
    min: 20,
    max: 500,
    step: 5,
    color: "#7F77DD",
  },
  {
    key: "fat",
    label: "Fat",
    unit: "g",
    min: 20,
    max: 200,
    step: 5,
    color: "#EF9F27",
  },
];

export default function AccountPage() {
  const token = sessionStorage.getItem("token");
  const userId = getUserIdFromToken(token);

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // ── Option lists from API ─────────────────────────────────────────────
  const [filterOptions, setFilterOptions] = useState({
    diets: [],
    allergies: [],
    cuisines: [],
  });
  const [cookingOptions, setCookingOptions] = useState({
    skillLevels: [],
    servingSizes: [],
    cookTimes: [],
  });

  // ── User preferences ──────────────────────────────────────────────────
  const [macros, setMacros] = useState({
    ...DEFAULT_MACROS,
  });
  const [selectedRestrictions, setSelectedRestrictions] = useState([]);
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [servingSize, setServingSize] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [cookTime, setCookTime] = useState("");

  // ── Snackbar ──────────────────────────────────────────────────────────
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackSeverity, setSnackSeverity] = useState("success");
  const [snackMsg, setSnackMsg] = useState("");

  // ── Fetch everything on mount ─────────────────────────────────────────
  useEffect(() => {
    if (!token || !userId) {
      setFetchError("No user session found. Please log in again.");
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const fetchAll = async () => {
      try {
        const [
          filters,
          skillLevels,
          servingSizes,
          cookTimes,
          nutrition,
          cooking,
          restrictions,
          allergens,
          cuisines,
        ] = await Promise.all([
          fetchRequired(`${API}/filters`, undefined, "filters"),
          fetchRequired(
            `${API}/filters/skill-level`,
            undefined,
            "skill levels",
          ),
          fetchRequired(
            `${API}/filters/serving-sizes`,
            undefined,
            "serving sizes",
          ),
          fetchRequired(`${API}/filters/cook-times`, undefined, "cook times"),
          fetchOptional(
            `${API}/users/${userId}/nutrition-targets`,
            { headers },
            DEFAULT_MACROS,
            "nutrition targets",
          ),
          fetchOptional(
            `${API}/users/${userId}/cooking-preferences`,
            { headers },
            {},
            "cooking preferences",
          ),
          fetchOptional(
            `${API}/users/${userId}/restrictions`,
            { headers },
            [],
            "dietary restrictions",
          ),
          fetchOptional(
            `${API}/users/${userId}/allergens`,
            { headers },
            [],
            "allergens",
          ),
          fetchOptional(
            `${API}/users/${userId}/cuisines`,
            { headers },
            [],
            "cuisines",
          ),
        ]);

        const normalizedSkillLevels = normalize(skillLevels);
        const normalizedServingSizes = normalize(servingSizes);
        const normalizedCookTimes = normalize(cookTimes);

        setFilterOptions({
          diets: normalize(filters?.diets),
          allergies: normalize(filters?.allergies),
          cuisines: normalize(filters?.cuisines),
        });

        setCookingOptions({
          skillLevels: normalizedSkillLevels,
          servingSizes: normalizedServingSizes,
          cookTimes: normalizedCookTimes,
        });

        setMacros({
          calories: nutrition?.calories ?? DEFAULT_MACROS.calories,
          protein: nutrition?.protein ?? DEFAULT_MACROS.protein,
          carbs: nutrition?.carbs ?? DEFAULT_MACROS.carbs,
          fat: nutrition?.fat ?? DEFAULT_MACROS.fat,
        });

        setServingSize(
          cooking?.serving_size ??
            cooking?.servingSize ??
            normalizedServingSizes[0] ??
            "",
        );
        setSkillLevel(
          cooking?.skill_level ??
            cooking?.skillLevel ??
            normalizedSkillLevels[0] ??
            "",
        );
        setCookTime(
          cooking?.max_cook_time ??
            cooking?.maxCookTime ??
            normalizedCookTimes[0] ??
            "",
        );

        setSelectedRestrictions(normalize(restrictions));
        setSelectedAllergens(normalize(allergens));
        setSelectedCuisines(normalize(cuisines));
      } catch (err) {
        setFetchError(err.message || "Failed to load preferences.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [token, userId]);

  const toggleChip = (list, setList, item) =>
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );

  const handleSave = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const results = await Promise.allSettled([
        savePreference(
          `${API}/users/${userId}/nutrition-targets`,
          macros,
          headers,
        ),
        savePreference(
          `${API}/users/${userId}/cooking-preferences`,
          {
            serving_size: servingSize,
            skill_level: skillLevel,
            max_cook_time: cookTime,
          },
          headers,
        ),
        savePreference(
          `${API}/users/${userId}/restrictions`,
          selectedRestrictions,
          headers,
        ),
        savePreference(
          `${API}/users/${userId}/allergens`,
          selectedAllergens,
          headers,
        ),
        savePreference(
          `${API}/users/${userId}/cuisines`,
          selectedCuisines,
          headers,
        ),
      ]);

      const anyFailed = results.some(
        (r) => r.status === "rejected" || !r.value?.ok,
      );

      if (anyFailed) {
        setSnackSeverity("error");
        setSnackMsg("Some preferences failed to save. Please try again.");
      } else {
        setSnackSeverity("success");
        setSnackMsg("Preferences saved!");
      }
    } catch (err) {
      console.log(err);
      setSnackSeverity("error");
      setSnackMsg("Failed to save preferences.");
    } finally {
      setSnackOpen(true);
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack alignItems="center" spacing={2}>
            <CircularProgress sx={{ color: "primary.main" }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontFamily: "system-ui, sans-serif" }}
            >
              Loading your preferences...
            </Typography>
          </Stack>
        </Box>
      </ThemeProvider>
    );
  }

  if (fetchError) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Alert
            severity="error"
            sx={{ fontFamily: "system-ui, sans-serif", maxWidth: 480 }}
          >
            {fetchError}
          </Alert>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Stack spacing={4}>
            {/* ── 1. Nutrition ── */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader
                  title="Daily nutrition targets"
                  sub="These guide recipe suggestions and your daily summary."
                />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 3,
                    mt: 1,
                  }}
                >
                  {MACROS.map(({ key: macroKey, ...rest }) => (
                    <MacroSlider
                      key={macroKey}
                      {...rest}
                      value={macros[macroKey]}
                      onChange={(val) =>
                        setMacros((prev) => ({ ...prev, [macroKey]: val }))
                      }
                    />
                  ))}
                </Box>
                <Alert
                  severity="info"
                  variant="outlined"
                  sx={{
                    mt: 3,
                    fontFamily: "system-ui, sans-serif",
                    fontSize: 13,
                    borderRadius: 2,
                  }}
                >
                  Not sure? Select a goal and we'll suggest targets for you.
                </Alert>
              </CardContent>
            </Card>

            {/* ── 2. Restrictions ── */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader
                  title="Diet Types"
                  sub="We'll always pick meals that align with your selections."
                />
                <ChipGroup
                  items={filterOptions.diets}
                  selected={selectedRestrictions}
                  onToggle={(item) =>
                    toggleChip(
                      selectedRestrictions,
                      setSelectedRestrictions,
                      item,
                    )
                  }
                  activeColor="#1D9E75"
                  activeBg="#E1F5EE"
                />

                <Divider sx={{ my: 3 }} />

                <SectionHeader
                  title="Allergens to avoid"
                  sub="Recipes containing these will be flagged or hidden."
                />
                <ChipGroup
                  items={filterOptions.allergies}
                  selected={selectedAllergens}
                  onToggle={(item) =>
                    toggleChip(selectedAllergens, setSelectedAllergens, item)
                  }
                  activeColor="#D85A30"
                  activeBg="#FAECE7"
                />
              </CardContent>
            </Card>

            {/* ── 3. Cooking Prefs ── */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <SectionHeader
                  title="Cooking style"
                  sub="Tailor recipes to your kitchen reality."
                />
                <Stack spacing={3} mt={1}>
                  <ToggleRow
                    label="Serving size"
                    options={cookingOptions.servingSizes}
                    value={servingSize}
                    onChange={setServingSize}
                    buttonSx={{ minWidth: 56, py: 1, flex: 1 }}
                  />
                  <ToggleRow
                    label="Skill level"
                    options={cookingOptions.skillLevels}
                    value={skillLevel}
                    onChange={setSkillLevel}
                  />
                  <ToggleRow
                    label="Max cook time"
                    options={cookingOptions.cookTimes}
                    value={cookTime}
                    onChange={setCookTime}
                  />
                </Stack>

                <Divider sx={{ my: 3 }} />

                <SectionHeader
                  title="Favourite cuisines"
                  sub="Pick as many as you like."
                />
                <ChipGroup
                  items={filterOptions.cuisines}
                  selected={selectedCuisines}
                  onToggle={(item) =>
                    toggleChip(selectedCuisines, setSelectedCuisines, item)
                  }
                  activeColor="#7F77DD"
                  activeBg="#EEEDFE"
                />
              </CardContent>
            </Card>
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              disableElevation
              onClick={handleSave}
              sx={{
                textTransform: "none",
                fontFamily: "system-ui, sans-serif",
                borderRadius: 2,
                px: 4,
                py: 1.2,
              }}
            >
              Save Changes
            </Button>
          </Box>
        </Container>

        <Snackbar
          open={snackOpen}
          autoHideDuration={2500}
          onClose={() => setSnackOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={snackSeverity}
            onClose={() => setSnackOpen(false)}
            sx={{ fontFamily: "system-ui, sans-serif" }}
          >
            {snackMsg || "Preferences saved!"}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <Box mb={2}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {sub}
      </Typography>
    </Box>
  );
}

function ChipGroup({ items, selected, onToggle, activeColor, activeBg }) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {items.map((item) => {
        const active = selected.includes(item);
        return (
          <Chip
            key={item}
            label={item}
            onClick={() => onToggle(item)}
            variant="outlined"
            sx={{
              cursor: "pointer",
              borderColor: active ? activeColor : "#E8E6DF",
              bgcolor: active ? activeBg : "transparent",
              color: active ? activeColor : "text.secondary",
              fontWeight: active ? 600 : 400,
              transition: "all 0.15s",
            }}
          />
        );
      })}
    </Box>
  );
}

function ToggleRow({ label, options, value, onChange }) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          fontWeight: 600,
          display: "block",
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={(_, val) => val && onChange(val)}
        size="medium"
        sx={{ flexWrap: "wrap", gap: 0.5, width: "100%" }}
      >
        {options.map((o) => (
          <ToggleButton
            key={o}
            value={o}
            sx={{
              borderRadius: "8px !important",
              border: "1px solid #E8E6DF !important",
            }}
          >
            {o}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}

function MacroSlider({ label, unit, min, max, step, value, color, onChange }) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          mb: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            fontSize: "1.1rem",
            fontFamily: "'Georgia', serif",
            color: "text.primary",
          }}
        >
          {value}
          <span
            style={{
              fontSize: 12,
              fontWeight: 400,
              color: "#888780",
              marginLeft: 2,
            }}
          >
            {unit}
          </span>
        </Typography>
      </Box>
      <Slider
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(_, val) => onChange(val)}
        size="small"
        sx={{ color, "& .MuiSlider-thumb": { width: 14, height: 14 } }}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="caption" color="text.disabled">
          {min}
        </Typography>
        <Typography variant="caption" color="text.disabled">
          {max}
        </Typography>
      </Box>
    </Box>
  );
}
