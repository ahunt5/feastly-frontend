import "./App.css";
import Layout from "./layout/Layout.jsx";
import { Route, Routes } from "react-router";
import LoginPage from "./auth/Login.jsx";
import RegisterPage from "./auth/Register.jsx";
import LogoutPage from "./auth/Logout.jsx";
import Error404 from "./Error404.jsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<></>} /> {/* TODO */}
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
