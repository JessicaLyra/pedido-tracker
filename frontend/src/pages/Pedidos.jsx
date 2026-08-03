import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

function Pedidos() {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [alterandoStatus, setAlterandoStatus] = useState(null);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function carregarPedidos() {
    try {
      setCarregando(true);
      setErro("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPedidos(response.data);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setErro("Não foi possível carregar os pedidos.");
    } finally {
      setCarregando(false);
    }
  }

  async function alterarStatus(id, novoStatus) {
    try {
      setAlterandoStatus(id);
      setErro("");

      const token = localStorage.getItem("token");

      await api.put(
        `/orders/${id}/status`,
        {
          status: novoStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPedidos((pedidosAtuais) =>
        pedidosAtuais.map((pedido) =>
          pedido.id === id
            ? {
                ...pedido,
                status: novoStatus,
              }
            : pedido
        )
      );
    } catch (error) {
      console.error("Erro ao alterar status:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setErro("Não foi possível atualizar o status do pedido.");
    } finally {
      setAlterandoStatus(null);
    }
  }

  function formatarStatus(status) {
    const statusMap = {
      RECEBIDO: "Recebido",
      EM_PREPARO: "Em preparo",
      SAIU_PARA_ENTREGA: "Saiu para entrega",
      ENTREGUE: "Entregue",
      CANCELADO: "Cancelado",
    };

    return statusMap[status] || status;
  }

  function corStatus(status) {
    const cores = {
      RECEBIDO: "#FF7800",
      EM_PREPARO: "#D97706",
      SAIU_PARA_ENTREGA: "#2563EB",
      ENTREGUE: "#16A34A",
      CANCELADO: "#DC2626",
    };

    return cores[status] || "#737373";
  }

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const termo = busca.toLowerCase().trim();

    if (!termo) {
      return true;
    }

    return (
      String(pedido.id).includes(termo) ||
      pedido.cliente?.toLowerCase().includes(termo) ||
      pedido.enderecoEntrega?.toLowerCase().includes(termo)
    );
  });

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
        {/* =====================================================
            CABEÇALHO
        ====================================================== */}

        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "stretch",
            lg: "center",
          }}
          spacing={3}
          mb={4}
        >
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
              Pedidos
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                fontSize: 13,
                color: "#737373",
              }}
            >
              Acompanhe e gerencie os pedidos da operação.
            </Typography>
          </Box>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1.5}
          >
            {/* BUSCA */}

            <Box
              sx={{
                position: "relative",
                minWidth: {
                  xs: "100%",
                  sm: 230,
                },
              }}
            >
              <SearchOutlinedIcon
                sx={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#A3A3A3",
                  fontSize: 19,
                  pointerEvents: "none",
                }}
              />

              <Box
                component="input"
                value={busca}
                onChange={(event) =>
                  setBusca(event.target.value)
                }
                placeholder="Buscar pedido..."
                sx={{
                  width: "100%",
                  height: 40,
                  boxSizing: "border-box",
                  border: "1px solid #E5E5E5",
                  borderRadius: "7px",
                  outline: "none",
                  backgroundColor: "#FFFFFF",
                  padding: "0 12px 0 38px",
                  fontSize: 13,
                  color: "#171717",
                  fontFamily: "inherit",

                  "&::placeholder": {
                    color: "#A3A3A3",
                  },

                  "&:focus": {
                    borderColor: "#FF7800",
                  },
                }}
              />
            </Box>

            {/* ATUALIZAR */}

            <Button
              variant="outlined"
              startIcon={<RefreshOutlinedIcon />}
              onClick={carregarPedidos}
              disabled={carregando}
              sx={{
                height: 40,
                px: 2,
                borderRadius: "7px",
                borderColor: "#E5E5E5",
                color: "#525252",
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",

                "&:hover": {
                  borderColor: "#D4D4D4",
                  backgroundColor: "#FAFAFA",
                },
              }}
            >
              Atualizar
            </Button>

            {/* NOVO PEDIDO */}

            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={() => navigate("/novo-pedido")}
              sx={{
                height: 40,
                px: 2,
                borderRadius: "7px",
                backgroundColor: "#FF7800",
                boxShadow: "none",
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",

                "&:hover": {
                  backgroundColor: "#E96800",
                  boxShadow: "none",
                },
              }}
            >
              Novo pedido
            </Button>
          </Stack>
        </Stack>

        {/* =====================================================
            RESUMO
        ====================================================== */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          mb={3}
        >
          <Paper
            elevation={0}
            sx={{
              px: 2,
              py: 1.5,
              minWidth: 150,
              border: "1px solid #E5E5E5",
              borderRadius: "7px",
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                color: "#737373",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Total de pedidos
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                fontSize: 21,
                fontWeight: 700,
                color: "#171717",
              }}
            >
              {pedidos.length}
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              px: 2,
              py: 1.5,
              minWidth: 150,
              border: "1px solid #E5E5E5",
              borderRadius: "7px",
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                color: "#737373",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Em andamento
            </Typography>

            <Typography
              sx={{
                mt: 0.3,
                fontSize: 21,
                fontWeight: 700,
                color: "#FF7800",
              }}
            >
              {
                pedidos.filter(
                  (pedido) =>
                    pedido.status !== "ENTREGUE" &&
                    pedido.status !== "CANCELADO"
                ).length
              }
            </Typography>
          </Paper>
        </Stack>

        {/* =====================================================
            ERRO
        ====================================================== */}

        {!carregando && erro && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "7px",
            }}
          >
            {erro}
          </Alert>
        )}

        {/* =====================================================
            CARREGANDO
        ====================================================== */}

        {carregando && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={10}
          >
            <CircularProgress
              size={30}
              sx={{
                color: "#FF7800",
              }}
            />
          </Box>
        )}

        {/* =====================================================
            NENHUM PEDIDO
        ====================================================== */}

        {!carregando &&
          !erro &&
          pedidosFiltrados.length === 0 && (
            <Paper
              elevation={0}
              sx={{
                border: "1px solid #E5E5E5",
                borderRadius: "8px",
                p: 6,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#404040",
                }}
              >
                Nenhum pedido encontrado.
              </Typography>

              <Typography
                sx={{
                  mt: 0.5,
                  fontSize: 13,
                  color: "#737373",
                }}
              >
                Tente alterar os termos da busca ou crie um
                novo pedido.
              </Typography>
            </Paper>
          )}

        {/* =====================================================
            LISTA DE PEDIDOS
        ====================================================== */}

        {!carregando &&
          !erro &&
          pedidosFiltrados.length > 0 && (
            <Stack spacing={2}>
              {pedidosFiltrados.map((pedido) => (
                <Paper
                  key={pedido.id}
                  elevation={0}
                  sx={{
                    border: "1px solid #E5E5E5",
                    borderRadius: "8px",
                    overflow: "hidden",
                    transition: "border-color 0.2s ease",

                    "&:hover": {
                      borderColor: "#D4D4D4",
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: {
                        xs: 2,
                        md: 2.5,
                      },
                    }}
                  >
                    {/* CABEÇALHO DO PEDIDO */}

                    <Stack
                      direction={{
                        xs: "column",
                        md: "row",
                      }}
                      justifyContent="space-between"
                      alignItems={{
                        xs: "flex-start",
                        md: "center",
                      }}
                      spacing={2}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#171717",
                          }}
                        >
                          Pedido #{pedido.id}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.3,
                            fontSize: 12,
                            color: "#737373",
                          }}
                        >
                          {pedido.cliente}
                        </Typography>
                      </Box>

                      {/* STATUS */}

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <Box
                          sx={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            backgroundColor: corStatus(
                              pedido.status
                            ),
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: corStatus(
                              pedido.status
                            ),
                          }}
                        >
                          {formatarStatus(pedido.status)}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Divider
                      sx={{
                        my: 2,
                      }}
                    />

                    {/* INFORMAÇÕES */}

                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "1fr",
                          md: "1.2fr 1fr 1fr",
                        },
                        gap: {
                          xs: 2,
                          md: 3,
                        },
                      }}
                    >
                      {/* ENDEREÇO */}

                      <Box>
                        <Typography
                          sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#A3A3A3",
                            textTransform: "uppercase",
                            letterSpacing: "0.6px",
                          }}
                        >
                          Endereço de entrega
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.7,
                            fontSize: 13,
                            color: "#404040",
                            lineHeight: 1.5,
                          }}
                        >
                          {pedido.enderecoEntrega}
                        </Typography>
                      </Box>

                      {/* ITENS */}

                      <Box>
                        <Typography
                          sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#A3A3A3",
                            textTransform: "uppercase",
                            letterSpacing: "0.6px",
                          }}
                        >
                          Itens
                        </Typography>

                        <Stack
                          spacing={0.5}
                          mt={0.7}
                        >
                          {pedido.itens?.map((item) => (
                            <Stack
                              key={item.id}
                              direction="row"
                              justifyContent="space-between"
                              spacing={2}
                            >
                              <Typography
                                sx={{
                                  fontSize: 13,
                                  color: "#404040",
                                }}
                              >
                                {item.nome}
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: "#525252",
                                }}
                              >
                                {item.quantidade}x
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>

                      {/* ALTERAÇÃO DE STATUS */}

                      <Box>
                        <Typography
                          sx={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#A3A3A3",
                            textTransform: "uppercase",
                            letterSpacing: "0.6px",
                          }}
                        >
                          Alterar status
                        </Typography>

                        <FormControl
                          size="small"
                          fullWidth
                          sx={{
                            mt: 0.7,
                          }}
                        >
                          <Select
                            value={pedido.status}
                            disabled={
                              alterandoStatus === pedido.id
                            }
                            onChange={(event) =>
                              alterarStatus(
                                pedido.id,
                                event.target.value
                              )
                            }
                            sx={{
                              height: 38,
                              fontSize: 13,
                              borderRadius: "7px",

                              "& .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#E5E5E5",
                                },

                              "&:hover .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#FF7800",
                                },

                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#FF7800",
                                },
                            }}
                          >
                            <MenuItem value="RECEBIDO">
                              Recebido
                            </MenuItem>

                            <MenuItem value="EM_PREPARO">
                              Em preparo
                            </MenuItem>

                            <MenuItem value="SAIU_PARA_ENTREGA">
                              Saiu para entrega
                            </MenuItem>

                            <MenuItem value="ENTREGUE">
                              Entregue
                            </MenuItem>

                            <MenuItem value="CANCELADO">
                              Cancelado
                            </MenuItem>
                          </Select>
                        </FormControl>

                        {alterandoStatus === pedido.id && (
                          <Stack
                            direction="row"
                            spacing={0.7}
                            alignItems="center"
                            mt={0.7}
                          >
                            <CircularProgress
                              size={12}
                              sx={{
                                color: "#FF7800",
                              }}
                            />

                            <Typography
                              sx={{
                                fontSize: 11,
                                color: "#737373",
                              }}
                            >
                              Salvando...
                            </Typography>
                          </Stack>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          )}
      </Container>
    </Box>
  );
}

export default Pedidos;