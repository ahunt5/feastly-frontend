# Feastly

## Overview

Feastly is a full-stack web application focused on nutrition tracking and meal logging, designed to help users better understand their eating habits and improve their health.

Users can track daily meals, monitor nutrition, and view trends over time.

The goal is to make nutrition tracking simple, insightful, and personalized.

[Feastly Backend](https://github.com/Feastly-Org/feastly-backend)

[Deployed Site](https://papaya-frangollo-63e6ec.netlify.app/)

---

## Core Features (MVP)

### Nutrition Tracking (Primary Focus)

- Daily/Weekly meal logging
- Macro tracking _(calories, protein, carbs, fat)_
- Nutrient breakdown dashboard

### Meal Logging & Planning

- Track meals by category _(breakfast, lunch, dinner, snacks)_
- Calendar-based tracking
- View historical nutrition data

### Recipe Management (Core Feature)

- Create recipes manually
- Save and edit recipes
- View saved recipes
- Link recipes to meals

### User System

- Authentication _(register/login)_
- User preferences & health info
- Personalized dashboard

---

## Stretch Features (AI + Enhancements)

### AI Features (Secondary)

- Generate recipes based on available ingredients
- Suggest meals based on:
  - User goals
  - Allergies
  - Preferences
- “Inspo” feature for meal ideas

### Additional Enhancements

- Upload recipes from external sources
- Barcode scanner for food items
- Auto grocery list generator
- Social media recipe import
- Guest browsing _(view recipes without account)_

---

## Wireframes

Below is the initial UI wireframe showing the layout of the application along with the schema of the database:

<p align="center">
  <img src="./public/Wireframe.png" width="800"/>
</p>

- Dashboard with daily meals _(breakfast/lunch/dinner/snacks)_
- Account settings panel
- Recipe & ingredient management page
- AI recipe generator interface

---

## Tech Stack

### Frontend

- React (UI Library)
- Vite (Build Tool & Development Server)
- React Router (Client-Side Routing)
- Material UI (Component Library & Styling)

---

## Architecture Overview

The frontend follows a component-based architecture, where pages represent routes, reusable components manage shared UI, and authentication state is handled globally through React Context.

### Project Structure

```bash
feastly-frontend/
├── src/ # Application source code
│ ├── auth/ # Authentication context and logic
│ ├── components/ # Reusable UI components
│ │ ├── layout/ # Layout and navigation components
│ ├── pages/ # Page-level components (routes)
│ ├── App.jsx # Main app component with routing
│ └── main.jsx # Entry point (renders React app)
│
└── assets/ # Static assets (images, wireframes)
```

---

## Frontend Routes

- `/` → Daily Log Dashboard
- `/login` → Login page
- `/register` → Register page
- `/logout` → Logout page
- `/ingredients/search` → Ingredient search page
- `/daily-totals` → Daily totals dashboard

---

## Authors

- **Mary Imevbore**
- **Albert Hunt**
- **Andrey Mikhalev**
- **Kayla Rampersaud**
