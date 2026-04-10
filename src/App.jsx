import "./App.css";
import Layout from "./components/layout/Layout.jsx";
import { Route, Routes } from "react-router";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import LogoutPage from "./pages/Logout.jsx";
import Error404 from "./pages/Error404.jsx";
import DailyLogPage from "./pages/DailyLogPage.jsx";
import { useAuth } from "./auth/AuthContext.jsx";
import RequireLogin from "./components/RequireLogin.jsx";
function App() {
  const { token } = useAuth();
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={token ? <DailyLogPage /> : <RequireLogin />} />{" "}
        {/* TODO */}
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/register" element={<RegisterPage />}></Route>
        <Route path="/logout" element={<LogoutPage />}></Route>
        {/* TODO: OTHER ROUTES */}
        <Route path="*" element={<Error404 />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
