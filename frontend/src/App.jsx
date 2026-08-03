import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Pedidos from "./pages/Pedidos";
import NovoPedido from "./pages/NovoPedido";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/pedidos"
          element={<Pedidos />}
        />

        <Route
          path="/novo-pedido"
          element={<NovoPedido />}
        />

        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;