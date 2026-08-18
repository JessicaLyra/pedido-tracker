import { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { Box } from "@mui/material";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Pedidos from "./pages/Pedidos";
import NovoPedido from "./pages/NovoPedido";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

function AppLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const rotasPublicas = ["/login", "/cadastro"];

  const rotaPublica = rotasPublicas.includes(
    location.pathname
  );

  return (
    <>
      {!rotaPublica && (
        <Sidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
      )}

      <Box
        component="main"
        sx={{
          minHeight: "100vh",

          marginLeft: {
            xs: 0,
            md: rotaPublica ? 0 : "250px",
          },

          width: {
            xs: "100%",
            md: rotaPublica
              ? "100%"
              : "calc(100% - 250px)",
          },

          transition:
            "margin-left 0.2s ease, width 0.2s ease",
        }}
      >
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/cadastro"
            element={<Cadastro />}
          />

          <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
          />

          <Route
            path="/pedidos"
            element={
              <ProtectedRoute>
                <Pedidos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/novo-pedido"
            element={
              <ProtectedRoute>
                <NovoPedido />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <Navigate
                to="/login"
                replace
              />
            }
          />
        </Routes>
      </Box>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;