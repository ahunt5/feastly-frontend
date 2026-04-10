import "./App.css";
import Layout from "./components/layout/Layout.jsx";
import { Route, Routes } from "react-router";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import LogoutPage from "./pages/Logout.jsx";
import Error404 from "./pages/Error404.jsx";
import DailyLogPage from "./pages/DailyLogPage.jsx";
import DailyTotal from "./pages/DailyTotals.jsx";
import IngredientSearchPage from "./pages/IngredientSearch.jsx";
import MealsPage from "./pages/MealsPage.jsx";
import { useAuth } from "./auth/AuthContext.jsx";
import RequireLogin from "./components/RequireLogin.jsx";
function App() {
  const { token } = useAuth();
  return token ? (
    <Routes>
      {/* Adds navbar */}
      <Route element={<Layout />}>
        <Route index element={<DailyLogPage />} />
        {/* All page routes */}
        <Route path="/daily-log" element={<DailyLogPage />}></Route>
        <Route path="/meals" element={<MealsPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/logout" element={<LogoutPage />}></Route>
        <Route path="/ingredients/search" element={<IngredientSearchPage />} />
        <Route path="/daily-totals" element={<DailyTotal />} />
        <Route path="*" element={<Error404 />}></Route>
      </Route>
    </Routes>
  ) : (
    <Routes>
      {/* No login routes */}
      <Route index element={<RequireLogin />}></Route>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/register" element={<RegisterPage />}></Route>
      <Route path="/logout" element={<LogoutPage />}></Route>
    </Routes>
  );
}

export default App;
