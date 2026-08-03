import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function carregarPedidos() {
    try {
      setCarregando(true);
      setErro("");

      const token = localStorage.getItem("token");

      const response = await api.get("/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPedidos(response.data);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os pedidos.");
    } finally {
      setCarregando(false);
    }
  }

  const pedidosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    return pedidos.filter((pedido) => {
      const correspondeBusca =
        !termo ||
        String(pedido.id).includes(termo) ||
        pedido.cliente?.toLowerCase().includes(termo) ||
        pedido.enderecoEntrega?.toLowerCase().includes(termo);

      const correspondeStatus =
        filtroStatus === "TODOS" ||
        pedido.status === filtroStatus;

      return correspondeBusca && correspondeStatus;
    });
  }, [pedidos, busca, filtroStatus]);

  function statusConfig(status) {
    const configuracoes = {
      RECEBIDO: {
        label: "Recebido",
        color: "#EA580C",
        background: "#FFF7ED",
      },

      EM_PREPARO: {
        label: "Em preparo",
        color: "#2563EB",
        background: "#EFF6FF",
      },

      SAIU_PARA_ENTREGA: {
        label: "Saiu para entrega",
        color: "#7C3AED",
        background: "#F5F3FF",
      },

      ENTREGUE: {
        label: "Entregue",
        color: "#16A34A",
        background: "#F0FDF4",
      },

      CANCELADO: {
        label: "Cancelado",
        color: "#DC2626",
        background: "#FEF2F2",
      },
    };

    return (
      configuracoes[status] || {
        label: status,
        color: "#64748B",
        background: "#F8FAFC",
      }
    );
  }

  const totalPedidos = pedidos.length;

  const recebidos = pedidos.filter(
    (pedido) => pedido.status === "RECEBIDO"
  ).length;

  const emPreparo = pedidos.filter(
    (pedido) => pedido.status === "EM_PREPARO"
  ).length;

  const emEntrega = pedidos.filter(
    (pedido) => pedido.status === "SAIU_PARA_ENTREGA"
  ).length;

  const entregues = pedidos.filter(
    (pedido) => pedido.status === "ENTREGUE"
  ).length;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#FFFFFF",
        color: "#171717",
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
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={2}
          mb={3}
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
              Gerencie todos os pedidos da operação.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            sx={{
              height: 40,
              px: 2,
              borderRadius: "7px",
              textTransform: "none",
              fontSize: 13,
              fontWeight: 600,
              backgroundColor: "#FF7800",
              boxShadow: "none",

              "&:hover": {
                backgroundColor: "#E96800",
                boxShadow: "none",
              },
            }}
          >
            Novo Pedido
          </Button>
        </Stack>

        {/* =====================================================
            INDICADORES
        ====================================================== */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              sm: "repeat(5, 1fr)",
            },
            border: "1px solid #E5E5E5",
            borderRadius: "8px",
            overflow: "hidden",
            mb: 3,
          }}
        >
          <Indicador
            titulo="Total de pedidos"
            valor={totalPedidos}
            destaque
          />

          <Indicador
            titulo="Recebidos"
            valor={recebidos}
            cor="#EA580C"
          />

          <Indicador
            titulo="Em preparo"
            valor={emPreparo}
            cor="#2563EB"
          />

          <Indicador
            titulo="Em entrega"
            valor={emEntrega}
            cor="#7C3AED"
          />

          <Indicador
            titulo="Entregues"
            valor={entregues}
            cor="#16A34A"
          />
        </Box>

        {/* =====================================================
            FILTROS
        ====================================================== */}

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            justifyContent: "space-between",
            gap: 1.5,
            mb: 2,
          }}
        >
          <TextField
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            placeholder="Buscar pedidos..."
            size="small"
            sx={{
              width: {
                xs: "100%",
                md: 340,
              },

              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "7px",
                fontSize: 13,
                backgroundColor: "#FFFFFF",

                "& fieldset": {
                  borderColor: "#DCDCDC",
                },

                "&:hover fieldset": {
                  borderColor: "#BDBDBD",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#FF7800",
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon
                    sx={{
                      fontSize: 19,
                      color: "#8A8A8A",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <Stack
            direction="row"
            spacing={1}
          >
            <Select
              value={filtroStatus}
              onChange={(event) =>
                setFiltroStatus(event.target.value)
              }
              size="small"
              sx={{
                height: 40,
                minWidth: 160,
                borderRadius: "7px",
                fontSize: 13,
                backgroundColor: "#FFFFFF",

                "& fieldset": {
                  borderColor: "#DCDCDC",
                },

                "&:hover fieldset": {
                  borderColor: "#BDBDBD",
                },
              }}
            >
              <MenuItem value="TODOS">
                Todos os status
              </MenuItem>

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

            <Button
              variant="outlined"
              onClick={carregarPedidos}
              disabled={carregando}
              startIcon={<RefreshOutlinedIcon />}
              sx={{
                height: 40,
                borderRadius: "7px",
                textTransform: "none",
                fontSize: 13,
                fontWeight: 600,
                color: "#525252",
                borderColor: "#DCDCDC",
                backgroundColor: "#FFFFFF",

                "&:hover": {
                  borderColor: "#BDBDBD",
                  backgroundColor: "#FAFAFA",
                },
              }}
            >
              Atualizar
            </Button>
          </Stack>
        </Box>

        {/* =====================================================
            ERRO
        ====================================================== */}

        {!carregando && erro && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: "7px",
            }}
          >
            {erro}
          </Alert>
        )}

        {/* =====================================================
            ÁREA DA TABELA
        ====================================================== */}

        <Box
          sx={{
            width: "100%",
            border: "1px solid #E5E5E5",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
          }}
        >
          {/* Cabeçalho */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "grid",
              },

              gridTemplateColumns:
                "90px minmax(170px, 1fr) 160px minmax(220px, 1.4fr) 160px 80px",

              alignItems: "center",

              px: 2.5,
              py: 1.6,

              backgroundColor: "#FAFAFA",

              borderBottom:
                "1px solid #E5E5E5",
            }}
          >
            <CabecalhoTabela>
              ID
            </CabecalhoTabela>

            <CabecalhoTabela>
              Cliente
            </CabecalhoTabela>

            <CabecalhoTabela>
              Status
            </CabecalhoTabela>

            <CabecalhoTabela>
              Endereço
            </CabecalhoTabela>

            <CabecalhoTabela>
              Itens
            </CabecalhoTabela>

            <CabecalhoTabela>
              Ações
            </CabecalhoTabela>
          </Box>

          {/* Loading */}

          {carregando && (
            <Box
              sx={{
                minHeight: 260,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress
                size={28}
                sx={{
                  color: "#FF7800",
                }}
              />
            </Box>
          )}

          {/* Nenhum resultado */}

          {!carregando &&
            pedidosFiltrados.length === 0 && (
              <Box
                sx={{
                  minHeight: 260,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  px: 2,
                }}
              >
                <ShoppingBagOutlinedIcon
                  sx={{
                    fontSize: 38,
                    color: "#D4D4D4",
                    mb: 1,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#404040",
                  }}
                >
                  Nenhum pedido encontrado
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: 12,
                    color: "#A3A3A3",
                  }}
                >
                  Tente alterar sua busca ou filtro.
                </Typography>
              </Box>
            )}

          {/* Linhas */}

          {!carregando &&
            pedidosFiltrados.map((pedido, index) => {
              const status = statusConfig(
                pedido.status
              );

              return (
                <Box
                  key={pedido.id}
                  sx={{
                    display: {
                      xs: "block",
                      md: "grid",
                    },

                    gridTemplateColumns:
                      "90px minmax(170px, 1fr) 160px minmax(220px, 1.4fr) 160px 80px",

                    alignItems: "center",

                    px: 2.5,
                    py: 1.8,

                    borderBottom:
                      index !==
                      pedidosFiltrados.length - 1
                        ? "1px solid #EEEEEE"
                        : "none",

                    transition:
                      "background-color 0.15s ease",

                    "&:hover": {
                      backgroundColor: "#FAFAFA",
                    },
                  }}
                >
                  {/* ID */}

                  <Box
                    sx={{
                      mb: {
                        xs: 1.5,
                        md: 0,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#262626",
                      }}
                    >
                      #{pedido.id}
                    </Typography>
                  </Box>

                  {/* Cliente */}

                  <Box
                    sx={{
                      mb: {
                        xs: 1.5,
                        md: 0,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#262626",
                      }}
                    >
                      {pedido.cliente}
                    </Typography>
                  </Box>

                  {/* Status */}

                  <Box
                    sx={{
                      mb: {
                        xs: 1.5,
                        md: 0,
                      },
                    }}
                  >
                    <Chip
                      label={status.label}
                      size="small"
                      sx={{
                        height: 25,
                        borderRadius: "5px",
                        fontSize: 11,
                        fontWeight: 600,
                        color: status.color,
                        backgroundColor:
                          status.background,

                        "& .MuiChip-label": {
                          px: 1,
                        },
                      }}
                    />
                  </Box>

                  {/* Endereço */}

                  <Box
                    sx={{
                      mb: {
                        xs: 1.5,
                        md: 0,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12.5,
                        color: "#737373",
                        whiteSpace: {
                          md: "nowrap",
                        },
                        overflow: {
                          md: "hidden",
                        },
                        textOverflow: {
                          md: "ellipsis",
                        },
                      }}
                    >
                      {pedido.enderecoEntrega}
                    </Typography>
                  </Box>

                  {/* Itens */}

                  <Box
                    sx={{
                      mb: {
                        xs: 1.5,
                        md: 0,
                      },
                    }}
                  >
                    <Stack spacing={0.4}>
                      {pedido.itens
                        ?.slice(0, 2)
                        .map((item) => (
                          <Typography
                            key={item.id}
                            sx={{
                              fontSize: 12,
                              color: "#525252",
                            }}
                          >
                            {item.quantidade}x{" "}
                            {item.nome}
                          </Typography>
                        ))}

                      {pedido.itens?.length > 2 && (
                        <Typography
                          sx={{
                            fontSize: 11,
                            color: "#A3A3A3",
                          }}
                        >
                          +{" "}
                          {pedido.itens.length - 2}{" "}
                          outros
                        </Typography>
                      )}
                    </Stack>
                  </Box>

                  {/* Ação */}

                  <Box>
                    <Button
                      variant="text"
                      size="small"
                      sx={{
                        minWidth: 34,
                        width: 34,
                        height: 34,
                        borderRadius: "6px",
                        color: "#737373",

                        "&:hover": {
                          backgroundColor: "#FFF7ED",
                          color: "#FF7800",
                        },
                      }}
                    >
                      <VisibilityOutlinedIcon
                        sx={{
                          fontSize: 19,
                        }}
                      />
                    </Button>
                  </Box>
                </Box>
              );
            })}
        </Box>

        {/* =====================================================
            RODAPÉ DA LISTAGEM
        ====================================================== */}

        {!carregando &&
          pedidosFiltrados.length > 0 && (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mt={2}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  color: "#737373",
                }}
              >
                Exibindo{" "}
                <strong>
                  {pedidosFiltrados.length}
                </strong>{" "}
                de{" "}
                <strong>
                  {pedidos.length}
                </strong>{" "}
                pedidos
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#A3A3A3",
                }}
              >
                Página 1
              </Typography>
            </Stack>
          )}
      </Container>
    </Box>
  );
}

/* =========================================================
   COMPONENTES AUXILIARES
========================================================= */

function Indicador({
  titulo,
  valor,
  cor = "#171717",
  destaque = false,
}) {
  return (
    <Box
      sx={{
        px: 2.5,
        py: 2,

        borderRight: {
          xs: "none",
          sm: "1px solid #E5E5E5",
        },

        borderBottom: {
          xs: "1px solid #E5E5E5",
          sm: "none",
        },

        "&:last-child": {
          borderRight: "none",
          borderBottom: "none",
        },
      }}
    >
      <Typography
        sx={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontWeight: 700,
          color: destaque ? "#171717" : "#737373",
        }}
      >
        {titulo}
      </Typography>

      <Typography
        sx={{
          mt: 0.4,
          fontSize: 23,
          lineHeight: 1,
          fontWeight: 700,
          color: cor,
        }}
      >
        {valor}
      </Typography>
    </Box>
  );
}

function CabecalhoTabela({ children }) {
  return (
    <Typography
      sx={{
        fontSize: 10,
        fontWeight: 700,
        color: "#737373",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      {children}
    </Typography>
  );
}

export default Pedidos;