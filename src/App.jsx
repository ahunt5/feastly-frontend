import "./App.css";
import Layout from "./components/layout/Layout.jsx";
import { Route, Routes } from "react-router";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import LogoutPage from "./pages/Logout.jsx";
import Error404 from "./pages/Error404.jsx";
import Dashboard from "./pages/dashboard.jsx";
import IngredientSearchPage from "./pages/IngredientSearch.jsx";
import MealsPage from "./pages/MealsPage.jsx";
import { useAuth } from "./auth/AuthContext.jsx";
import RequireLogin from "./components/RequireLogin.jsx";

function App() {
  const { token } = useAuth();

  return token ? (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/meals" element={<MealsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/ingredients/search" element={<IngredientSearchPage />} />
        <Route path="*" element={<Error404 />} />
      </Route>
    </Routes>
  ) : (
    <Routes>
      <Route index element={<RequireLogin />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/logout" element={<LogoutPage />} />
    </Routes>
  );
}

export default App;
