import "./App.css";
import Layout from "./components/layout/Layout.jsx";
import { Route, Routes } from "react-router-dom";
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
  return (
    <Routes>
      {/* Adds navbar */}
      <Route element={<Layout />}>
        <Route index element={token ? <DailyLogPage /> : <RequireLogin />} />{" "}
        {/* All page routes */}
        <Route
          path="/daily-log"
          element={token ? <DailyLogPage /> : <RequireLogin />}
        ></Route>
        <Route
          path="/meals"
          element={token ? <MealsPage /> : <RequireLogin />}
        ></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/logout" element={<LogoutPage />}></Route>
        <Route
          path="/ingredients/search"
          element={token ? <IngredientSearchPage /> : <RequireLogin />}
        />
        <Route
          path="/daily-totals"
          element={token ? <DailyTotal /> : <RequireLogin />}
        />{" "}
        {/* If route does not exist, give the user a 404 Error */}
        <Route path="*" element={<Error404 />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
