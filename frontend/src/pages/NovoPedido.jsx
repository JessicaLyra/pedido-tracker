import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import {
  Alert,
  Box,
  Button,
  Container,
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
      (item) => !item.quantidade || item.quantidade < 1
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
        setErro("Sua sessão expirou. Faça login novamente.");
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
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          px: {
            xs: 2,
            sm: 3,
            md: 4,
            lg: 5,
          },
          py: {
            xs: 3,
            md: 4,
          },
        }}
      >
        {/* CABEÇALHO */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          mb={4}
        >
          <IconButton
            onClick={voltar}
            sx={{
              width: 38,
              height: 38,
              border: "1px solid #E5E5E5",
              borderRadius: "7px",
              color: "#525252",

              "&:hover": {
                backgroundColor: "#FFF7ED",
                borderColor: "#FF7800",
                color: "#FF7800",
              },
            }}
          >
            <ArrowBackOutlinedIcon fontSize="small" />
          </IconButton>

          <Box>
            <Typography
              sx={{
                fontSize: {
                  xs: 25,
                  md: 28,
                },
                fontWeight: 700,
                color: "#171717",
                letterSpacing: "-0.5px",
              }}
            >
              Novo pedido
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 13,
                color: "#737373",
              }}
            >
              Cadastre um novo pedido para a operação.
            </Typography>
          </Box>
        </Stack>

        {/* FORMULÁRIO */}

        <Box
          component="form"
          onSubmit={salvarPedido}
          sx={{
            maxWidth: 1000,
          }}
        >
          {/* DADOS DO CLIENTE */}

          <Paper
            elevation={0}
            sx={{
              border: "1px solid #E5E5E5",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: {
                  xs: 2,
                  md: 3,
                },
                py: 2,
                backgroundColor: "#FAFAFA",
                borderBottom: "1px solid #E5E5E5",
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#171717",
                }}
              >
                Dados do cliente
              </Typography>

              <Typography
                sx={{
                  mt: 0.3,
                  fontSize: 12,
                  color: "#737373",
                }}
              >
                Informe os dados necessários para a entrega.
              </Typography>
            </Box>

            <Box
              sx={{
                p: {
                  xs: 2,
                  md: 3,
                },
              }}
            >
              <Stack spacing={2.5}>
                <TextField
                  label="Cliente"
                  placeholder="Nome do cliente"
                  value={cliente}
                  onChange={(event) =>
                    setCliente(event.target.value)
                  }
                  fullWidth
                  size="small"
                />

                <TextField
                  label="Endereço de entrega"
                  placeholder="Rua, número, bairro..."
                  value={endereco}
                  onChange={(event) =>
                    setEndereco(event.target.value)
                  }
                  fullWidth
                  size="small"
                />

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
                />
              </Stack>
            </Box>
          </Paper>

          {/* ITENS */}

          <Paper
            elevation={0}
            sx={{
              mt: 3,
              border: "1px solid #E5E5E5",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: {
                  xs: 2,
                  md: 3,
                },
                py: 2,
                backgroundColor: "#FAFAFA",
                borderBottom: "1px solid #E5E5E5",
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#171717",
                    }}
                  >
                    Itens do pedido
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.3,
                      fontSize: 12,
                      color: "#737373",
                    }}
                  >
                    Adicione os produtos e suas quantidades.
                  </Typography>
                </Box>

                <ShoppingBagOutlinedIcon
                  sx={{
                    color: "#FF7800",
                    fontSize: 23,
                  }}
                />
              </Stack>
            </Box>

            <Box
              sx={{
                p: {
                  xs: 2,
                  md: 3,
                },
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
                        sm: "1fr 130px 42px",
                      },
                      gap: 1.5,
                      alignItems: "center",
                    }}
                  >
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
                    />

                    <TextField
                      label="Quantidade"
                      type="number"
                      value={item.quantidade}
                      onChange={(event) =>
                        alterarItem(
                          item.id,
                          "quantidade",
                          Math.max(
                            1,
                            Number(event.target.value)
                          )
                        )
                      }
                      size="small"
                      inputProps={{
                        min: 1,
                      }}
                    />

                    <IconButton
                      type="button"
                      onClick={() =>
                        removerItem(item.id)
                      }
                      disabled={itens.length === 1}
                      sx={{
                        width: 40,
                        height: 40,
                        color:
                          itens.length === 1
                            ? "#D4D4D4"
                            : "#737373",

                        "&:hover": {
                          backgroundColor: "#FEF2F2",
                          color: "#DC2626",
                        },
                      }}
                    >
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}

                <Divider />

                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<AddOutlinedIcon />}
                  onClick={adicionarItem}
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
                  }}
                >
                  Adicionar item
                </Button>
              </Stack>
            </Box>
          </Paper>

          {/* ERRO */}

          {erro && (
            <Alert
              severity="error"
              sx={{
                mt: 3,
                borderRadius: "7px",
              }}
            >
              {erro}
            </Alert>
          )}

          {/* AÇÕES */}

          <Stack
            direction={{
              xs: "column-reverse",
              sm: "row",
            }}
            justifyContent="flex-end"
            spacing={1.5}
            mt={3}
          >
            <Button
              type="button"
              variant="outlined"
              onClick={voltar}
              disabled={salvando}
              sx={{
                height: 40,
                px: 2.5,
                borderRadius: "7px",
                borderColor: "#DCDCDC",
                color: "#525252",
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,

                "&:hover": {
                  borderColor: "#BDBDBD",
                  backgroundColor: "#FAFAFA",
                },
              }}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={salvando}
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
              }}
            >
              {salvando ? "Criando..." : "Criar pedido"}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default NovoPedido;