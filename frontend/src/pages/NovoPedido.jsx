import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

function NovoPedido() {
  const navigate = useNavigate();

  const [cliente, setCliente] = useState("");
  const [endereco, setEndereco] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const [itens, setItens] = useState([
    {
      id: 1,
      nome: "",
      quantidade: 1,
    },
  ]);

  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  function adicionarItem() {
    setItens((itensAtuais) => [
      ...itensAtuais,
      {
        id: Date.now(),
        nome: "",
        quantidade: 1,
      },
    ]);
  }

  function removerItem(id) {
    if (itens.length === 1) {
      return;
    }

    setItens((itensAtuais) =>
      itensAtuais.filter((item) => item.id !== id)
    );
  }

  function alterarItem(id, campo, valor) {
    setItens((itensAtuais) =>
      itensAtuais.map((item) =>
        item.id === id
          ? {
              ...item,
              [campo]: valor,
            }
          : item
      )
    );
  }

  function voltar() {
    if (salvando) {
      return;
    }

    navigate("/pedidos");
  }

  async function salvarPedido(event) {
    event.preventDefault();

    setErro("");

    if (!cliente.trim()) {
      setErro("Informe o nome do cliente.");
      return;
    }

    if (!endereco.trim()) {
      setErro("Informe o endereço de entrega.");
      return;
    }

    const existeItemVazio = itens.some(
      (item) => !item.nome.trim()
    );

    if (existeItemVazio) {
      setErro("Informe o nome de todos os itens.");
      return;
    }

    const quantidadeInvalida = itens.some(
      (item) => !item.quantidade || Number(item.quantidade) < 1
    );

    if (quantidadeInvalida) {
      setErro("A quantidade dos itens deve ser maior que zero.");
      return;
    }

    try {
      setSalvando(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setErro("Sua sessão expirou. Faça login novamente.");
        navigate("/login");
        return;
      }

      const pedido = {
        cliente: cliente.trim(),
        enderecoEntrega: endereco.trim(),

        itens: itens.map((item) => ({
          nome: item.nome.trim(),
          quantidade: Number(item.quantidade),
        })),
      };

      await api.post("/orders", pedido, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/pedidos");
    } catch (error) {
      console.error("Erro ao criar pedido:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        setErro("Sua sessão expirou. Faça login novamente.");
        navigate("/login");
        return;
      }

      if (error.response?.status === 403) {
        setErro("Você não tem permissão para criar pedidos.");
        return;
      }

      if (error.response?.data?.message) {
        setErro(error.response.data.message);
        return;
      }

      setErro(
        "Não foi possível criar o pedido. Tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* =====================================================
          CONTEÚDO DA PÁGINA
          A Sidebar fica no layout principal.
          Esta página ocupa somente a área disponível.
      ====================================================== */}

      <Box
        component="main"
        sx={{
          width: "100%",
          px: {
            xs: 2,
            sm: 3,
            md: 5,
            lg: 6,
            xl: 8,
          },
          py: {
            xs: 3,
            md: 5,
          },
          boxSizing: "border-box",
        }}
      >
        {/* =====================================================
            CABEÇALHO
        ====================================================== */}

        <Box
          sx={{
            width: "100%",
            mb: 4,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
          >
            {/* VOLTAR */}

            <IconButton
              onClick={voltar}
              disabled={salvando}
              aria-label="Voltar para pedidos"
              sx={{
                width: 38,
                height: 38,
                flexShrink: 0,
                border: "1px solid #E5E5E5",
                borderRadius: "8px",
                color: "#525252",

                "&:hover": {
                  backgroundColor: "#FFF7ED",
                  borderColor: "#FF7800",
                  color: "#FF7800",
                },

                "&:disabled": {
                  color: "#D4D4D4",
                  borderColor: "#EEEEEE",
                },
              }}
            >
              <ArrowBackOutlinedIcon
                sx={{
                  fontSize: 19,
                }}
              />
            </IconButton>

            {/* TÍTULO */}

            <Box
              sx={{
                minWidth: 0,
              }}
            >
              <Typography
                sx={{
                  fontSize: {
                    xs: 26,
                    md: 30,
                  },
                  fontWeight: 700,
                  color: "#171717",
                  letterSpacing: "-0.8px",
                  lineHeight: 1.2,
                }}
              >
                Novo pedido
              </Typography>

              <Typography
                sx={{
                  mt: 0.7,
                  fontSize: 13,
                  color: "#737373",
                }}
              >
                Cadastre um novo pedido para a operação.
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* =====================================================
            FORMULÁRIO
        ====================================================== */}

        <Box
          component="form"
          onSubmit={salvarPedido}
          sx={{
            width: "100%",
            maxWidth: 1100,
          }}
        >
          {/* =================================================
              DADOS DO CLIENTE
          ================================================== */}

          <Paper
            elevation={0}
            sx={{
              width: "100%",
              border: "1px solid #E5E5E5",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: "#FFFFFF",
            }}
          >
            {/* CABEÇALHO DO CARD */}

            <Box
              sx={{
                px: {
                  xs: 2.5,
                  md: 3,
                },
                py: 2,
                borderBottom: "1px solid #E5E5E5",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: "#171717",
                }}
              >
                Dados do cliente
              </Typography>

              <Typography
                sx={{
                  mt: 0.4,
                  fontSize: 12,
                  color: "#737373",
                }}
              >
                Informe os dados necessários para a entrega.
              </Typography>
            </Box>

            {/* CAMPOS */}

            <Box
              sx={{
                px: {
                  xs: 2.5,
                  md: 3,
                },
                py: 3,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1.4fr",
                  },
                  gap: 2,
                }}
              >
                {/* CLIENTE */}

                <TextField
                  label="Cliente"
                  placeholder="Nome do cliente"
                  value={cliente}
                  onChange={(event) =>
                    setCliente(event.target.value)
                  }
                  fullWidth
                  size="small"
                  disabled={salvando}
                  sx={estiloCampo}
                />

                {/* ENDEREÇO */}

                <TextField
                  label="Endereço de entrega"
                  placeholder="Rua, número, bairro..."
                  value={endereco}
                  onChange={(event) =>
                    setEndereco(event.target.value)
                  }
                  fullWidth
                  size="small"
                  disabled={salvando}
                  sx={estiloCampo}
                />

                {/* OBSERVAÇÕES */}

                <TextField
                  label="Observações"
                  placeholder="Alguma informação adicional?"
                  value={observacoes}
                  onChange={(event) =>
                    setObservacoes(event.target.value)
                  }
                  fullWidth
                  multiline
                  minRows={3}
                  size="small"
                  disabled={salvando}
                  sx={{
                    ...estiloCampo,

                    gridColumn: {
                      xs: "auto",
                      md: "1 / -1",
                    },
                  }}
                />
              </Box>
            </Box>
          </Paper>

          {/* =================================================
              ITENS DO PEDIDO
          ================================================== */}

          <Paper
            elevation={0}
            sx={{
              width: "100%",
              mt: 3,
              border: "1px solid #E5E5E5",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundColor: "#FFFFFF",
            }}
          >
            {/* CABEÇALHO */}

            <Box
              sx={{
                px: {
                  xs: 2.5,
                  md: 3,
                },
                py: 2,
                borderBottom: "1px solid #E5E5E5",
                backgroundColor: "#FFFFFF",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#171717",
                    }}
                  >
                    Itens do pedido
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.4,
                      fontSize: 12,
                      color: "#737373",
                    }}
                  >
                    Adicione os produtos e suas quantidades.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    backgroundColor: "#FFF7ED",
                    color: "#FF7800",
                  }}
                >
                  <ShoppingBagOutlinedIcon
                    sx={{
                      fontSize: 20,
                    }}
                  />
                </Box>
              </Stack>
            </Box>

            {/* LISTA DE ITENS */}

            <Box
              sx={{
                px: {
                  xs: 2.5,
                  md: 3,
                },
                py: 3,
              }}
            >
              <Stack spacing={2}>
                {itens.map((item, index) => (
                  <Box
                    key={item.id}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "minmax(0, 1fr) 130px 40px",
                      },
                      gap: 1.5,
                      alignItems: "center",
                    }}
                  >
                    {/* PRODUTO */}

                    <TextField
                      label={
                        index === 0
                          ? "Produto"
                          : `Produto ${index + 1}`
                      }
                      placeholder="Nome do produto"
                      value={item.nome}
                      onChange={(event) =>
                        alterarItem(
                          item.id,
                          "nome",
                          event.target.value
                        )
                      }
                      size="small"
                      fullWidth
                      disabled={salvando}
                      sx={estiloCampo}
                    />

                    {/* QUANTIDADE */}

                    <TextField
                      label="Quantidade"
                      type="number"
                      value={item.quantidade}
                      onChange={(event) => {
                        const valor = Number(
                          event.target.value
                        );

                        alterarItem(
                          item.id,
                          "quantidade",
                          valor < 1 ? 1 : valor
                        );
                      }}
                      size="small"
                      fullWidth
                      disabled={salvando}
                      inputProps={{
                        min: 1,
                      }}
                      sx={estiloCampo}
                    />

                    {/* REMOVER */}

                    <IconButton
                      type="button"
                      onClick={() =>
                        removerItem(item.id)
                      }
                      disabled={
                        itens.length === 1 || salvando
                      }
                      aria-label={`Remover ${
                        item.nome || "item"
                      }`}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "7px",
                        color:
                          itens.length === 1 || salvando
                            ? "#D4D4D4"
                            : "#737373",

                        "&:hover": {
                          backgroundColor: "#FEF2F2",
                          color: "#DC2626",
                        },
                      }}
                    >
                      <DeleteOutlineOutlinedIcon
                        sx={{
                          fontSize: 19,
                        }}
                      />
                    </IconButton>
                  </Box>
                ))}

                <Divider sx={{ my: 0.5 }} />

                {/* ADICIONAR ITEM */}

                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<AddOutlinedIcon />}
                  onClick={adicionarItem}
                  disabled={salvando}
                  sx={{
                    alignSelf: "flex-start",
                    height: 38,
                    px: 2,
                    borderRadius: "7px",
                    borderColor: "#FF7800",
                    color: "#FF7800",
                    textTransform: "none",
                    fontSize: 13,
                    fontWeight: 600,

                    "&:hover": {
                      borderColor: "#E96800",
                      backgroundColor: "#FFF7ED",
                    },

                    "&:disabled": {
                      borderColor: "#E5E5E5",
                      color: "#A3A3A3",
                    },
                  }}
                >
                  Adicionar item
                </Button>
              </Stack>
            </Box>
          </Paper>

          {/* =================================================
              ERRO
          ================================================== */}

          {erro && (
            <Alert
              severity="error"
              sx={{
                mt: 3,
                borderRadius: "8px",
                fontSize: 13,
              }}
            >
              {erro}
            </Alert>
          )}

          {/* =================================================
              AÇÕES
          ================================================== */}

          <Stack
            direction={{
              xs: "column-reverse",
              sm: "row",
            }}
            justifyContent="flex-end"
            spacing={1.5}
            mt={3}
          >
            {/* CANCELAR */}

            <Button
              type="button"
              variant="outlined"
              onClick={voltar}
              disabled={salvando}
              sx={{
                height: 40,
                px: 2.5,
                borderRadius: "7px",
                borderColor: "#E5E5E5",
                color: "#525252",
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,

                "&:hover": {
                  borderColor: "#D4D4D4",
                  backgroundColor: "#FAFAFA",
                },
              }}
            >
              Cancelar
            </Button>

            {/* CRIAR PEDIDO */}

            <Button
              type="submit"
              variant="contained"
              disabled={salvando}
              startIcon={
                salvando ? (
                  <CircularProgress
                    size={16}
                    sx={{
                      color: "#FFFFFF",
                    }}
                  />
                ) : null
              }
              sx={{
                height: 40,
                px: 2.5,
                borderRadius: "7px",
                backgroundColor: "#FF7800",
                boxShadow: "none",
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,

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
              {salvando ? "Criando..." : "Criar pedido"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

/* =========================================================
   ESTILO DOS CAMPOS
========================================================= */

const estiloCampo = {
  "& .MuiInputLabel-root": {
    fontSize: 13,
    color: "#737373",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#FF7800",
  },

  "& .MuiOutlinedInput-root": {
    borderRadius: "7px",
    fontSize: 13,
    backgroundColor: "#FFFFFF",

    "& fieldset": {
      borderColor: "#E5E5E5",
    },

    "&:hover fieldset": {
      borderColor: "#D4D4D4",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#FF7800",
      borderWidth: "1px",
    },

    "&.Mui-disabled": {
      backgroundColor: "#FAFAFA",
    },
  },
};

export default NovoPedido;