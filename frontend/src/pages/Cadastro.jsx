import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import api from "../services/api";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve possuir pelo menos 6 caracteres.");
      return;
    }

    try {
      setCarregando(true);

      await api.post("/auth/register", {
        nome,
        email,
        senha,
      });

      setSucesso("Usuário criado com sucesso!");

      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);

      if (error.response?.status === 409) {
        setErro(
          error.response?.data ||
            "Este e-mail já está cadastrado."
        );
      } else if (error.response?.data) {
        setErro(
          typeof error.response.data === "string"
            ? error.response.data
            : "Não foi possível realizar o cadastro."
        );
      } else {
        setErro("Não foi possível realizar o cadastro.");
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
        backgroundColor: "#F6F6F4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: {
          xs: 2,
          sm: 3,
        },
        py: {
          xs: 4,
          sm: 5,
        },
        boxSizing: "border-box",
      }}
    >
      {/* ÁREA PRINCIPAL */}

      <Box
        sx={{
          width: "100%",
          maxWidth: 460,
        }}
      >
        {/* CARD */}

        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E7E5E1",
            borderRadius: {
              xs: "12px",
              sm: "14px",
            },
            px: {
              xs: 3,
              sm: 4.5,
            },
            py: {
              xs: 3.5,
              sm: 4.5,
            },
            boxShadow:
              "0 10px 35px rgba(0, 0, 0, 0.05)",
          }}
        >
          {/* LOGO */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Box
              component="img"
              src="/logo delivery tracker.png"
              alt="Delivery Tracker"
              sx={{
                width: {
                  xs: 155,
                  sm: 175,
                },
                height: "auto",
                display: "block",
              }}
            />
          </Box>

          {/* TÍTULO */}

          <Box
            sx={{
              textAlign: "center",
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: 24,
                  sm: 26,
                },
                fontWeight: 700,
                color: "#171717",
                letterSpacing: "-0.5px",
                lineHeight: 1.2,
              }}
            >
              Criar sua conta
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                fontSize: 13,
                color: "#737373",
                lineHeight: 1.5,
              }}
            >
              Cadastre-se para começar a gerenciar
              seus pedidos.
            </Typography>
          </Box>

          {/* FORMULÁRIO */}

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <Stack spacing={2}>
              {/* NOME */}

              <Box>
                    <Stack
                    direction="row"
                    spacing={0.6}
                    alignItems="center"
                    sx={{
                        mb: 0.7,
                    }}
                    >
                    <PersonOutlineOutlinedIcon
                        sx={{
                        fontSize: 16,
                        color: "#737373",
                        }}
                    />

                    <Typography
                        component="label"
                        htmlFor="nome"
                        sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#404040",
                        }}
                    >
                        Nome
                    </Typography>
                    </Stack>

                <TextField
                  id="nome"
                  fullWidth
                  value={nome}
                  onChange={(event) =>
                    setNome(event.target.value)
                  }
                  placeholder="Digite seu nome"
                  autoComplete="name"
                  required
                  size="small"
                  sx={estiloCampo}
                />
              </Box>

              {/* E-MAIL */}

              <Box>
                <Stack
                    direction="row"
                    spacing={0.6}
                    alignItems="center"
                    sx={{
                        mb: 0.7,
                    }}
                    >
                    <EmailOutlinedIcon
                        sx={{
                        fontSize: 16,
                        color: "#737373",
                        }}
                    />

                    <Typography
                        component="label"
                        htmlFor="email"
                        sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#404040",
                        }}
                    >
                        E-mail
                    </Typography>
                    </Stack>

                <TextField
                  id="email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Digite seu e-mail"
                  autoComplete="email"
                  required
                  size="small"
                  sx={estiloCampo}
                />
              </Box>

              {/* SENHA */}

              <Box>
                <Stack
                    direction="row"
                    spacing={0.6}
                    alignItems="center"
                    sx={{
                        mb: 0.7,
                    }}
                    >
                    <LockOutlinedIcon
                        sx={{
                        fontSize: 16,
                        color: "#737373",
                        }}
                    />

                    <Typography
                        component="label"
                        htmlFor="senha"
                        sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#404040",
                        }}
                    >
                        Senha
                    </Typography>
                    </Stack>

                <TextField
                  id="senha"
                  type="password"
                  fullWidth
                  value={senha}
                  onChange={(event) =>
                    setSenha(event.target.value)
                  }
                  placeholder="Digite sua senha"
                  autoComplete="new-password"
                  required
                  size="small"
                  sx={estiloCampo}
                />
              </Box>

              {/* CONFIRMAR SENHA */}

              <Box>
                <Stack
                    direction="row"
                    spacing={0.6}
                    alignItems="center"
                    sx={{
                        mb: 0.7,
                    }}
                    >
                    <LockOutlinedIcon
                        sx={{
                        fontSize: 16,
                        color: "#737373",
                        }}
                    />

                    <Typography
                        component="label"
                        htmlFor="confirmarSenha"
                        sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#404040",
                        }}
                    >
                        Confirmar senha
                    </Typography>
                    </Stack>

                <TextField
                  id="confirmarSenha"
                  type="password"
                  fullWidth
                  value={confirmarSenha}
                  onChange={(event) =>
                    setConfirmarSenha(event.target.value)
                  }
                  placeholder="Digite a senha novamente"
                  autoComplete="new-password"
                  required
                  size="small"
                  sx={estiloCampo}
                />
              </Box>

              {/* ERRO */}

              {erro && (
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: "7px",
                    fontSize: 12,
                    py: 0.5,
                  }}
                >
                  {erro}
                </Alert>
              )}

              {/* SUCESSO */}

              {sucesso && (
                <Alert
                  severity="success"
                  sx={{
                    borderRadius: "7px",
                    fontSize: 12,
                    py: 0.5,
                  }}
                >
                  {sucesso}
                </Alert>
              )}

              {/* BOTÃO */}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={carregando}
                sx={{
                  height: 44,
                  mt: 0.5,
                  borderRadius: "7px",
                  backgroundColor: "#FF7800",
                  boxShadow: "none",
                  textTransform: "none",
                  fontSize: 13,
                  fontWeight: 700,

                  "&:hover": {
                    backgroundColor: "#E96800",
                    boxShadow: "none",
                  },

                  "&:disabled": {
                    backgroundColor: "#FDBA74",
                    color: "#FFFFFF",
                  },
                }}
              >
                {carregando ? (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <CircularProgress
                      size={17}
                      sx={{
                        color: "#FFFFFF",
                      }}
                    />

                    <span>Criando conta...</span>
                  </Stack>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </Stack>
          </Box>

          {/* LOGIN */}

          <Box
            sx={{
              mt: 3,
              pt: 2.5,
              borderTop: "1px solid #EEEEEC",
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
              Já possui uma conta?{" "}
            </Typography>

            <Button
              type="button"
              onClick={() => navigate("/login")}
              sx={{
                minWidth: "auto",
                p: 0,
                verticalAlign: "baseline",
                color: "#FF7800",
                textTransform: "none",
                fontSize: 12,
                fontWeight: 700,

                "&:hover": {
                  backgroundColor: "transparent",
                  color: "#E96800",
                },
              }}
            >
              Entrar
            </Button>
          </Box>
        </Box>

        {/* RODAPÉ */}

        <Typography
          sx={{
            mt: 2.5,
            textAlign: "center",
            fontSize: 11,
            color: "#A3A3A3",
          }}
        >
          Delivery Tracker
        </Typography>
      </Box>
    </Box>
  );
}

const estiloCampo = {
  "& .MuiOutlinedInput-root": {
    height: 42,
    borderRadius: "7px",
    backgroundColor: "#FFFFFF",
    fontSize: 13,

    "& fieldset": {
      borderColor: "#E2E0DC",
    },

    "&:hover fieldset": {
      borderColor: "#D4D1CC",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#FF7800",
      borderWidth: "1px",
    },
  },

  "& input::placeholder": {
    color: "#A3A3A3",
    opacity: 1,
  },
};

export default Cadastro;