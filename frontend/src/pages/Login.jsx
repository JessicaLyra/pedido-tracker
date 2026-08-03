import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      
      login(response.data);

      navigate("/dashboard");
    } catch (error) {
      if (error.response?.data?.mensagem) {
        setErro(error.response.data.mensagem);
      } else {
        setErro("Não foi possível realizar o login.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#111111",
        px: {
          xs: 2,
          sm: 3,
        },
        py: 4,
        boxSizing: "border-box",
      }}
    >
      {/* PAINEL PRINCIPAL */}

      <Box
        sx={{
          width: "100%",
          maxWidth: 430,
          backgroundColor: "#1A1A1A",
          border: "1px solid #2A2A2A",
          borderRadius: {
            xs: "14px",
            sm: "16px",
          },
          boxShadow: "0 24px 70px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
        }}
      >
        {/* ÁREA DO LOGO / CABEÇALHO */}

        <Box
          sx={{
            px: {
              xs: 3,
              sm: 4,
            },
            pt: {
              xs: 3.5,
              sm: 4.5,
            },
            pb: 3,
            textAlign: "center",
          }}
        >
          <Box
            component="img"
            src="/logo delivery tracker.png"
            alt="Delivery Tracker"
            sx={{
              width: {
                xs: 190,
                sm: 215,
              },
              maxWidth: "100%",
              height: "auto",
              display: "block",
              mx: "auto",
            }}
          />

          <Typography
            sx={{
              mt: 2.5,
              fontSize: {
                xs: 22,
                sm: 24,
              },
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.4px",
            }}
          >
            Bem-vindo de volta
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              fontSize: 13,
              color: "#A3A3A3",
              lineHeight: 1.5,
            }}
          >
            Entre na sua conta para acompanhar seus pedidos.
          </Typography>
        </Box>

        {/* FORMULÁRIO */}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            px: {
              xs: 3,
              sm: 4,
            },
            pb: {
              xs: 3,
              sm: 4,
            },
          }}
        >
          {/* E-MAIL */}

          <Box>
            <Typography
              component="label"
              htmlFor="email"
              sx={{
                display: "block",
                mb: 0.8,
                fontSize: 12,
                fontWeight: 600,
                color: "#D4D4D4",
              }}
            >
              E-mail
            </Typography>

            <TextField
              id="email"
              type="email"
              fullWidth
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Digite seu e-mail"
              required
              autoComplete="email"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 44,
                  borderRadius: "7px",
                  backgroundColor: "#222222",
                  color: "#FFFFFF",
                  fontSize: 13,

                  "& fieldset": {
                    borderColor: "#353535",
                  },

                  "&:hover fieldset": {
                    borderColor: "#4A4A4A",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#FF7800",
                  },
                },

                "& .MuiInputBase-input::placeholder": {
                  color: "#737373",
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* SENHA */}

          <Box sx={{ mt: 2.2 }}>
            <Typography
              component="label"
              htmlFor="senha"
              sx={{
                display: "block",
                mb: 0.8,
                fontSize: 12,
                fontWeight: 600,
                color: "#D4D4D4",
              }}
            >
              Senha
            </Typography>

            <TextField
              id="senha"
              type="password"
              fullWidth
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Digite sua senha"
              required
              autoComplete="current-password"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: 44,
                  borderRadius: "7px",
                  backgroundColor: "#222222",
                  color: "#FFFFFF",
                  fontSize: 13,

                  "& fieldset": {
                    borderColor: "#353535",
                  },

                  "&:hover fieldset": {
                    borderColor: "#4A4A4A",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#FF7800",
                  },
                },

                "& .MuiInputBase-input::placeholder": {
                  color: "#737373",
                  opacity: 1,
                },
              }}
            />
          </Box>

          {/* ERRO */}

          {erro && (
            <Alert
              severity="error"
              sx={{
                mt: 2,
                borderRadius: "7px",
                fontSize: 12,
                backgroundColor: "#351919",
                color: "#FCA5A5",

                "& .MuiAlert-icon": {
                  color: "#EF4444",
                },
              }}
            >
              {erro}
            </Alert>
          )}

          {/* BOTÃO ENTRAR */}

          <Button
            type="submit"
            fullWidth
            disabled={carregando}
            startIcon={
              carregando ? (
                <CircularProgress
                  size={16}
                  sx={{
                    color: "#FFFFFF",
                  }}
                />
              ) : (
                <LockOutlinedIcon />
              )
            }
            sx={{
              mt: 2.5,
              height: 44,
              borderRadius: "7px",
              backgroundColor: "#FF7800",
              color: "#FFFFFF",
              textTransform: "none",
              fontSize: 13,
              fontWeight: 700,
              boxShadow: "none",

              "&:hover": {
                backgroundColor: "#E96800",
                boxShadow: "none",
              },

              "&.Mui-disabled": {
                backgroundColor: "#A34F0A",
                color: "#D4D4D4",
              },
            }}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </Button>

          {/* CADASTRO */}

          <Box
            sx={{
              mt: 2.5,
              pt: 2.5,
              borderTop: "1px solid #2A2A2A",
              textAlign: "center",
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: 12,
                color: "#737373",
              }}
            >
              Ainda não tem uma conta?{" "}
            </Typography>

            <Typography
              component={Link}
              to="/cadastro"
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: "#FF7800",
                textDecoration: "none",

                "&:hover": {
                  color: "#FF963D",
                  textDecoration: "underline",
                },
              }}
            >
              Cadastre-se
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Login;