import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  function login(novoToken) {
    localStorage.setItem("token", novoToken);
    setToken(novoToken);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
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