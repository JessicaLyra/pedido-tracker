import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [usuario, setUsuario] = useState(() => {
    try {
      const usuarioSalvo =
        localStorage.getItem("usuario");

      return usuarioSalvo
        ? JSON.parse(usuarioSalvo)
        : null;
    } catch (error) {
      console.error(
        "Erro ao recuperar usuário:",
        error
      );

      localStorage.removeItem("usuario");

      return null;
    }
  });

  function login(dados) {
    localStorage.setItem("token", dados.token);

    localStorage.setItem(
      "usuario",
      JSON.stringify(dados)
    );

    setToken(dados.token);
    setUsuario(dados);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    setToken(null);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        usuario,
        login,
        logout,
        autenticado: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}