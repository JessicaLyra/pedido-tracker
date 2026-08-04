import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

function Pedidos() {
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [alterandoStatus, setAlterandoStatus] = useState(null);

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("TODOS");

  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [carregandoDetalhes, setCarregandoDetalhes] = useState(false);

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
        localStorage.removeItem("usuario");

        navigate("/login");
        return;
      }

      setErro("Não foi possível carregar os pedidos.");
    } finally {
      setCarregando(false);
    }
  }

  async function abrirDetalhes(pedido) {
    try {
      setErro("");
      setCarregandoDetalhes(true);

      setPedidoSelecionado(null);
      setModalAberto(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setModalAberto(false);
        navigate("/login");
        return;
      }

      const response = await api.get(`/orders/${pedido.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPedidoSelecionado(response.data);
    } catch (error) {
      console.error("Erro ao carregar detalhes do pedido:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        setModalAberto(false);
        navigate("/login");
        return;
      }

      setErro("Não foi possível carregar os detalhes do pedido.");
    } finally {
      setCarregandoDetalhes(false);
    }
  }

  function fecharDetalhes() {
    setModalAberto(false);
    setPedidoSelecionado(null);
    setCarregandoDetalhes(false);
  }

  async function alterarStatus(id, novoStatus) {
    try {
      setAlterandoStatus(id);
      setErro("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

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

      setPedidoSelecionado((pedidoAtual) =>
        pedidoAtual
          ? {
              ...pedidoAtual,
              status: novoStatus,
            }
          : pedidoAtual
      );
    } catch (error) {
      console.error("Erro ao alterar status:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

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

  function estiloStatus(status) {
    const estilos = {
      RECEBIDO: {
        cor: "#EA580C",
        fundo: "#FFF7ED",
        borda: "#FED7AA",
      },

      EM_PREPARO: {
        cor: "#B45309",
        fundo: "#FFFBEB",
        borda: "#FDE68A",
      },

      SAIU_PARA_ENTREGA: {
        cor: "#2563EB",
        fundo: "#EFF6FF",
        borda: "#BFDBFE",
      },

      ENTREGUE: {
        cor: "#16A34A",
        fundo: "#F0FDF4",
        borda: "#BBF7D0",
      },

      CANCELADO: {
        cor: "#DC2626",
        fundo: "#FEF2F2",
        borda: "#FECACA",
      },
    };

    return (
      estilos[status] || {
        cor: "#737373",
        fundo: "#F5F5F5",
        borda: "#E5E5E5",
      }
    );
  }

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const termo = busca.toLowerCase().trim();

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

  const pedidosEmAndamento = pedidos.filter(
    (pedido) =>
      pedido.status !== "ENTREGUE" &&
      pedido.status !== "CANCELADO"
  ).length;

  const pedidosEntregues = pedidos.filter(
    (pedido) => pedido.status === "ENTREGUE"
  ).length;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Box
        component="main"
        sx={{
          width: "100%",
          minHeight: "100vh",

          px: {
            xs: 2,
            sm: 3,
            md: 5,
            lg: 6,
          },

          py: {
            xs: 8,
            lg: 5,
          },

          boxSizing: "border-box",
        }}
      >
        {/* CABEÇALHO */}

        <Box
          sx={{
            mb: 4,
          }}
        >
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

                  letterSpacing: "-0.7px",
                  lineHeight: 1.2,
                }}
              >
                Pedidos
              </Typography>

              <Typography
                sx={{
                  mt: 0.7,
                  fontSize: 13,
                  color: "#737373",
                }}
              >
                Acompanhe e gerencie os pedidos da operação.
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                width: {
                  xs: "100%",
                  sm: "auto",
                },
              }}
            >
              <Button
                variant="outlined"
                startIcon={<RefreshOutlinedIcon />}
                onClick={carregarPedidos}
                disabled={carregando}
                sx={{
                  height: 40,
                  px: 2,

                  flex: {
                    xs: 1,
                    sm: "initial",
                  },

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
                Atualizar
              </Button>

              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                onClick={() => navigate("/novo-pedido")}
                sx={{
                  height: 40,
                  px: 2,

                  flex: {
                    xs: 1,
                    sm: "initial",
                  },

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
                Novo pedido
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* RESUMO */}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",

            borderTop: "1px solid #E5E5E5",
            borderBottom: "1px solid #E5E5E5",

            mb: 3,
          }}
        >
          <Box
            sx={{
              py: 2,

              pr: {
                xs: 3,
                md: 5,
              },

              mr: {
                xs: 3,
                md: 5,
              },

              borderRight: "1px solid #E5E5E5",
            }}
          >
            <Typography sx={tituloResumo}>
              Total de pedidos
            </Typography>

            <Typography sx={numeroResumo}>
              {pedidos.length}
            </Typography>
          </Box>

          <Box
            sx={{
              py: 2,

              pr: {
                xs: 3,
                md: 5,
              },

              mr: {
                xs: 3,
                md: 5,
              },

              borderRight: "1px solid #E5E5E5",
            }}
          >
            <Typography sx={tituloResumo}>
              Em andamento
            </Typography>

            <Typography
              sx={{
                ...numeroResumo,
                color: "#FF7800",
              }}
            >
              {pedidosEmAndamento}
            </Typography>
          </Box>

          <Box
            sx={{
              py: 2,
            }}
          >
            <Typography sx={tituloResumo}>
              Entregues
            </Typography>

            <Typography
              sx={{
                ...numeroResumo,
                color: "#16A34A",
              }}
            >
              {pedidosEntregues}
            </Typography>
          </Box>
        </Box>

        {/* FILTROS */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1.5}
          sx={{
            mb: 3,
            width: "100%",
          }}
        >
          <TextField
            value={busca}
            onChange={(event) =>
              setBusca(event.target.value)
            }
            placeholder="Buscar pedido, cliente ou endereço..."
            size="small"
            sx={{
              width: {
                xs: "100%",
                sm: 360,
                md: 430,
              },

              "& .MuiOutlinedInput-root": {
                height: 40,

                borderRadius: "7px",

                backgroundColor: "#FAFAFA",

                fontSize: 13,

                "& fieldset": {
                  borderColor: "#E5E5E5",
                },

                "&:hover fieldset": {
                  borderColor: "#D4D4D4",
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
                      color: "#A3A3A3",
                    }}
                  />
                </InputAdornment>
              ),
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: {
                xs: "100%",
                sm: 190,
              },
            }}
          >
            <Select
              value={filtroStatus}
              onChange={(event) =>
                setFiltroStatus(event.target.value)
              }
              displayEmpty
              sx={{
                height: 40,

                borderRadius: "7px",

                backgroundColor: "#FAFAFA",

                fontSize: 13,

                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#E5E5E5",
                },

                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#D4D4D4",
                },

                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#FF7800",
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
          </FormControl>
        </Stack>

        {/* ERRO */}

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

        {/* CARREGANDO */}

        {carregando && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 10,
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

        {/* NENHUM PEDIDO */}

        {!carregando &&
          !erro &&
          pedidosFiltrados.length === 0 && (
            <Box
              sx={{
                borderTop: "1px solid #E5E5E5",
                borderBottom: "1px solid #E5E5E5",

                py: 8,

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
                  mt: 0.6,
                  fontSize: 13,
                  color: "#737373",
                }}
              >
                Tente alterar os filtros ou crie um novo pedido.
              </Typography>
            </Box>
          )}

        {/* TABELA */}

        {!carregando &&
          !erro &&
          pedidosFiltrados.length > 0 && (
            <Box
              sx={{
                width: "100%",

                overflowX: {
                  xs: "auto",
                  md: "hidden",
                },

                border: "1px solid #E8E8E8",

                borderRadius: "10px",

                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  minWidth: {
                    xs: 850,
                    md: "100%",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "grid",

                    gridTemplateColumns:
                      "70px minmax(150px, 1.2fr) minmax(130px, 0.9fr) minmax(180px, 1.4fr) minmax(150px, 1fr) 70px",

                    gap: 2,

                    px: 2,
                    py: 1.5,

                    backgroundColor: "#FAFAFA",

                    borderBottom: "1px solid #E5E5E5",
                  }}
                >
                  <Typography sx={tituloColuna}>
                    ID
                  </Typography>

                  <Typography sx={tituloColuna}>
                    Nome
                  </Typography>

                  <Typography sx={tituloColuna}>
                    Status
                  </Typography>

                  <Typography sx={tituloColuna}>
                    Endereço
                  </Typography>

                  <Typography sx={tituloColuna}>
                    Itens
                  </Typography>

                  <Typography
                    sx={{
                      ...tituloColuna,
                      textAlign: "center",
                    }}
                  >
                    Ações
                  </Typography>
                </Box>

                {pedidosFiltrados.map((pedido) => {
                  const status = estiloStatus(
                    pedido.status
                  );

                  return (
                    <Box
                      key={pedido.id}
                      sx={{
                        display: "grid",

                        gridTemplateColumns:
                          "70px minmax(150px, 1.2fr) minmax(130px, 0.9fr) minmax(180px, 1.4fr) minmax(150px, 1fr) 70px",

                        gap: 2,

                        alignItems: "center",

                        minHeight: 76,

                        px: 2,

                        borderBottom:
                          "1px solid #E5E5E5",

                        transition:
                          "background-color 0.15s ease",

                        "&:last-child": {
                          borderBottom: "none",
                        },

                        "&:hover": {
                          backgroundColor: "#FCFCFC",
                        },
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#171717",
                        }}
                      >
                        #{pedido.id}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#262626",

                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {pedido.cliente}
                      </Typography>

                      <Box
                        sx={{
                          display: "inline-flex",

                          alignItems: "center",

                          gap: 0.8,

                          width: "fit-content",

                          px: 1,

                          height: 27,

                          borderRadius: "6px",

                          backgroundColor:
                            status.fundo,

                          border: `1px solid ${status.borda}`,
                        }}
                      >
                        <Box
                          sx={{
                            width: 6,
                            height: 6,

                            borderRadius: "50%",

                            backgroundColor:
                              status.cor,
                          }}
                        />

                        <Typography
                          sx={{
                            fontSize: 11,

                            fontWeight: 600,

                            color: status.cor,

                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatarStatus(
                            pedido.status
                          )}
                        </Typography>
                      </Box>

                      <Typography
                        sx={{
                          fontSize: 12,

                          color: "#737373",

                          overflow: "hidden",

                          textOverflow: "ellipsis",

                          whiteSpace: "nowrap",
                        }}
                        title={pedido.enderecoEntrega}
                      >
                        {pedido.enderecoEntrega}
                      </Typography>

                      <Stack spacing={0.4}>
                        {pedido.itens?.map((item) => (
                          <Stack
                            key={item.id}
                            direction="row"
                            spacing={0.7}
                            alignItems="center"
                          >
                            <Typography
                              sx={{
                                fontSize: 12,

                                color: "#404040",

                                overflow: "hidden",

                                textOverflow:
                                  "ellipsis",

                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {item.nome}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: 11,

                                fontWeight: 700,

                                color: "#737373",
                              }}
                            >
                              {item.quantidade}x
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <IconButton
                          onClick={() =>
                            abrirDetalhes(pedido)
                          }
                          aria-label={`Ver pedido ${pedido.id}`}
                          sx={{
                            width: 34,
                            height: 34,

                            borderRadius: "7px",

                            color: "#737373",

                            border:
                              "1px solid #E5E5E5",

                            "&:hover": {
                              color: "#FF7800",

                              borderColor:
                                "#FF7800",

                              backgroundColor:
                                "#FFF7ED",
                            },
                          }}
                        >
                          <VisibilityOutlinedIcon
                            sx={{
                              fontSize: 18,
                            }}
                          />
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
      </Box>

      {/* MODAL DE DETALHES */}

      <Dialog
        open={modalAberto}
        onClose={fecharDetalhes}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "16px",

            overflow: "hidden",

            boxShadow:
              "0 24px 80px rgba(0,0,0,0.18)",

            margin: {
              xs: 1.5,
              sm: 2,
            },
          },
        }}
      >
        {/* LOADING DOS DETALHES */}

        {carregandoDetalhes && (
          <Box
            sx={{
              minHeight: 320,

              display: "flex",

              flexDirection: "column",

              justifyContent: "center",

              alignItems: "center",

              gap: 1.5,
            }}
          >
            <CircularProgress
              size={30}
              sx={{
                color: "#FF7800",
              }}
            />

            <Typography
              sx={{
                fontSize: 13,
                color: "#737373",
              }}
            >
              Carregando pedido...
            </Typography>
          </Box>
        )}

        {/* CONTEÚDO DO PEDIDO */}

        {!carregandoDetalhes &&
          pedidoSelecionado && (
            <>
              {/* CABEÇALHO */}

              <DialogTitle
                sx={{
                  px: {
                    xs: 2.5,
                    sm: 3.5,
                  },

                  py: 2.5,

                  borderBottom:
                    "1px solid #E5E5E5",

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
                        fontSize: {
                          xs: 20,
                          sm: 22,
                        },

                        fontWeight: 700,

                        color: "#171717",

                        letterSpacing: "-0.5px",

                        lineHeight: 1.2,
                      }}
                    >
                      Pedido #{pedidoSelecionado.id}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.6,

                        fontSize: 12,

                        color: "#737373",
                      }}
                    >
                      Informações e gerenciamento do pedido
                    </Typography>
                  </Box>
                </Stack>
              </DialogTitle>

              {/* CONTEÚDO */}

              <DialogContent
                sx={{
                  px: {
                    xs: 2.5,
                    sm: 3.5,
                  },

                  py: 3,
                }}
              >
                {/* STATUS ATUAL */}

                <Box
                  sx={{
                    mb: 3,

                    p: 2.2,

                    borderRadius: "11px",

                    backgroundColor: "#FAFAFA",

                    border:
                      "1px solid #E5E5E5",
                  }}
                >
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
                    spacing={1.5}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#737373",
                          textTransform: "uppercase",
                          letterSpacing: "0.6px",
                        }}
                      >
                        Status atual
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.5,

                          fontSize: 12,

                          color: "#737373",
                        }}
                      >
                        Situação atual deste pedido
                      </Typography>
                    </Box>

                    {(() => {
                      const status = estiloStatus(
                        pedidoSelecionado.status
                      );

                      return (
                        <Box
                          sx={{
                            display: "inline-flex",

                            alignItems: "center",

                            gap: 1,

                            px: 1.5,

                            height: 36,

                            borderRadius: "8px",

                            backgroundColor:
                              status.fundo,

                            border: `1px solid ${status.borda}`,

                            boxShadow:
                              "0 1px 2px rgba(0,0,0,0.03)",
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,

                              borderRadius: "50%",

                              backgroundColor:
                                status.cor,
                            }}
                          />

                          <Typography
                            sx={{
                              fontSize: 12,

                              fontWeight: 700,

                              color:
                                status.cor,

                              whiteSpace:
                                "nowrap",
                            }}
                          >
                            {formatarStatus(
                              pedidoSelecionado.status
                            )}
                          </Typography>
                        </Box>
                      );
                    })()}
                  </Stack>
                </Box>

                {/* DADOS DO CLIENTE */}

                <Box
                  sx={{
                    mb: 3,
                  }}
                >
                  <Typography
                    sx={{
                      mb: 1.5,

                      fontSize: 10,
                      fontWeight: 700,

                      color: "#737373",

                      textTransform:
                        "uppercase",

                      letterSpacing:
                        "0.6px",
                    }}
                  >
                    Dados da entrega
                  </Typography>

                  <Box
                    sx={{
                      display: "grid",

                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "1fr 1.3fr",
                      },

                      gap: 1.5,
                    }}
                  >
                    {/* CLIENTE */}

                    <Box
                      sx={{
                        p: 2,

                        border:
                          "1px solid #E5E5E5",

                        borderRadius: "10px",

                        backgroundColor:
                          "#FFFFFF",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 10,

                          fontWeight: 700,

                          color: "#A3A3A3",

                          textTransform:
                            "uppercase",

                          letterSpacing:
                            "0.5px",
                        }}
                      >
                        Cliente
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.7,

                          fontSize: 15,

                          fontWeight: 700,

                          color: "#171717",

                          lineHeight: 1.4,

                          wordBreak:
                            "break-word",
                        }}
                      >
                        {pedidoSelecionado.cliente}
                      </Typography>
                    </Box>

                    {/* ENDEREÇO */}

                    <Box
                      sx={{
                        p: 2,

                        border:
                          "1px solid #E5E5E5",

                        borderRadius: "10px",

                        backgroundColor:
                          "#FFFFFF",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 10,

                          fontWeight: 700,

                          color: "#A3A3A3",

                          textTransform:
                            "uppercase",

                          letterSpacing:
                            "0.5px",
                        }}
                      >
                        Endereço de entrega
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.7,

                          fontSize: 13,

                          fontWeight: 500,

                          color: "#404040",

                          lineHeight: 1.5,

                          wordBreak:
                            "break-word",
                        }}
                      >
                        {
                          pedidoSelecionado.enderecoEntrega
                        }
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Divider
                  sx={{
                    mb: 3,
                  }}
                />

                {/* ITENS */}

                <Box mb={3}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1.5}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 10,

                          fontWeight: 700,

                          color: "#737373",

                          textTransform:
                            "uppercase",

                          letterSpacing:
                            "0.6px",
                        }}
                      >
                        Itens do pedido
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.4,
                          mr: 2,

                          fontSize: 12,

                          color: "#737373",
                        }}
                      >
                        Produtos incluídos neste pedido
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        px: 0,

                        py: 2,

                        borderRadius: "6px",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 11,
                          px: 1,
                          fontWeight: 700,
                          backgroundColor: "#F5F5F5",
                          color: "#525252",
                        }}
                      >
                        {
                          pedidoSelecionado.itens
                            ?.length || 0
                        }{" "}
                        {pedidoSelecionado.itens
                          ?.length === 1
                          ? "item"
                          : "itens"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack spacing={0.8}>
                    {pedidoSelecionado.itens?.map(
                      (item) => (
                        <Box
                          key={item.id}
                          sx={{
                            display: "flex",

                            alignItems: "center",

                            justifyContent:
                              "space-between",

                            gap: 2,

                            px: 1.7,

                            py: 1.3,

                            border:
                              "1px solid #E5E5E5",

                            borderRadius: "9px",

                            backgroundColor:
                              "#FFFFFF",

                            transition:
                              "background-color 0.15s ease, border-color 0.15s ease",

                            "&:hover": {
                              backgroundColor:
                                "#FAFAFA",

                              borderColor:
                                "#DADADA",
                            },
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: 13,

                              fontWeight: 600,

                              color: "#404040",

                              lineHeight: 1.4,
                            }}
                          >
                            {item.nome}
                          </Typography>

                          <Box
                            sx={{
                              minWidth: 38,

                              height: 27,

                              px: 1,

                              display: "flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              borderRadius:
                                "6px",

                              backgroundColor:
                                "#F5F5F5",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 11,

                                fontWeight: 700,

                                color: "#404040",
                              }}
                            >
                              {item.quantidade}x
                            </Typography>
                          </Box>
                        </Box>
                      )
                    )}
                  </Stack>
                </Box>

                <Divider
                  sx={{
                    mb: 3,
                  }}
                />

                {/* ALTERAR STATUS */}

                <Box
                  sx={{
                    p: 2.2,

                    borderRadius: "11px",

                    border:
                      "1px solid #E5E5E5",

                    backgroundColor:
                      "#FCFCFC",
                  }}
                >
                  <Box
                    sx={{
                      mb: 1.8,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 10,

                        fontWeight: 700,

                        color: "#737373",

                        textTransform:
                          "uppercase",

                        letterSpacing:
                          "0.6px",
                      }}
                    >
                      Atualizar status
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,

                        fontSize: 12,

                        color: "#737373",

                        lineHeight: 1.5,
                      }}
                    >
                      Selecione o novo status para
                      atualizar o andamento deste pedido.
                    </Typography>
                  </Box>

                  <FormControl
                    fullWidth
                    size="small"
                  >
                    <Select
                      value={
                        pedidoSelecionado.status
                      }
                      disabled={
                        alterandoStatus ===
                        pedidoSelecionado.id
                      }
                      onChange={(event) =>
                        alterarStatus(
                          pedidoSelecionado.id,
                          event.target.value
                        )
                      }
                      renderValue={(valor) => {
                        const status =
                          estiloStatus(valor);

                        return (
                          <Box
                            sx={{
                              display: "flex",

                              alignItems:
                                "center",

                              gap: 1,
                            }}
                          >
                            <Box
                              sx={{
                                width: 8,
                                height: 8,

                                borderRadius:
                                  "50%",

                                backgroundColor:
                                  status.cor,
                              }}
                            />

                            <Typography
                              sx={{
                                fontSize: 13,

                                fontWeight: 600,

                                color: "#262626",
                              }}
                            >
                              {formatarStatus(
                                valor
                              )}
                            </Typography>
                          </Box>
                        );
                      }}
                      sx={{
                        height: 46,

                        borderRadius: "8px",

                        fontSize: 13,

                        backgroundColor:
                          "#FFFFFF",

                        "& .MuiOutlinedInput-notchedOutline":
                          {
                            borderColor:
                              "#DADADA",
                          },

                        "&:hover .MuiOutlinedInput-notchedOutline":
                          {
                            borderColor:
                              "#C7C7C7",
                          },

                        "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                          {
                            borderColor:
                              "#FF7800",

                            borderWidth:
                              "1px",
                          },

                        "&.Mui-disabled": {
                          backgroundColor:
                            "#F5F5F5",
                        },
                      }}
                    >
                      <MenuItem
                        value="RECEBIDO"
                        sx={{
                          fontSize: 13,
                          py: 1.2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius:
                                "50%",
                              backgroundColor:
                                "#EA580C",
                            }}
                          />

                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          >
                            Recebido
                          </Typography>
                        </Box>
                      </MenuItem>

                      <MenuItem
                        value="EM_PREPARO"
                        sx={{
                          fontSize: 13,
                          py: 1.2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius:
                                "50%",
                              backgroundColor:
                                "#B45309",
                            }}
                          />

                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          >
                            Em preparo
                          </Typography>
                        </Box>
                      </MenuItem>

                      <MenuItem
                        value="SAIU_PARA_ENTREGA"
                        sx={{
                          fontSize: 13,
                          py: 1.2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius:
                                "50%",
                              backgroundColor:
                                "#2563EB",
                            }}
                          />

                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          >
                            Saiu para entrega
                          </Typography>
                        </Box>
                      </MenuItem>

                      <MenuItem
                        value="ENTREGUE"
                        sx={{
                          fontSize: 13,
                          py: 1.2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius:
                                "50%",
                              backgroundColor:
                                "#16A34A",
                            }}
                          />

                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          >
                            Entregue
                          </Typography>
                        </Box>
                      </MenuItem>

                      <MenuItem
                        value="CANCELADO"
                        sx={{
                          fontSize: 13,
                          py: 1.2,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.2,
                          }}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius:
                                "50%",
                              backgroundColor:
                                "#DC2626",
                            }}
                          />

                          <Typography
                            sx={{
                              fontSize: 13,
                              fontWeight: 500,
                            }}
                          >
                            Cancelado
                          </Typography>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>

                  {alterandoStatus ===
                    pedidoSelecionado.id && (
                    <Box
                      sx={{
                        mt: 1.5,

                        px: 1.5,
                        py: 1,

                        display: "flex",

                        alignItems:
                          "center",

                        gap: 1,

                        borderRadius: "7px",

                        backgroundColor:
                          "#FFF7ED",

                        border:
                          "1px solid #FED7AA",
                      }}
                    >
                      <CircularProgress
                        size={15}
                        thickness={5}
                        sx={{
                          color:
                            "#FF7800",
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: 11,

                          fontWeight: 600,

                          color: "#C2410C",
                        }}
                      >
                        Salvando alteração...
                      </Typography>
                    </Box>
                  )}
                </Box>
              </DialogContent>

              {/* RODAPÉ */}

              <DialogActions
                sx={{
                  px: {
                    xs: 2.5,
                    sm: 3.5,
                  },

                  py: 1.8,

                  borderTop:
                    "1px solid #E5E5E5",

                  backgroundColor:
                    "#FCFCFC",

                  justifyContent:
                    "flex-end",
                }}
              >
                <Button
                  onClick={fecharDetalhes}
                  sx={{
                    minWidth: 82,

                    height: 38,

                    px: 2,

                    borderRadius: "7px",

                    textTransform:
                      "none",

                    fontSize: 12,

                    fontWeight: 600,

                    color: "#525252",

                    border:
                      "1px solid #E5E5E5",

                    backgroundColor:
                      "#FFFFFF",

                    "&:hover": {
                      backgroundColor:
                        "#F5F5F5",

                      borderColor:
                        "#D4D4D4",
                    },
                  }}
                >
                  Fechar
                </Button>
              </DialogActions>
            </>
          )}
      </Dialog>
    </Box>
  );
}

/* =========================================================
   ESTILOS
========================================================= */

const tituloColuna = {
  fontSize: 10,
  fontWeight: 700,
  color: "#A3A3A3",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
};

const tituloResumo = {
  fontSize: 10,
  fontWeight: 700,
  color: "#A3A3A3",
  textTransform: "uppercase",
  letterSpacing: "0.6px",
};

const numeroResumo = {
  mt: 0.4,
  fontSize: 22,
  fontWeight: 700,
  color: "#171717",
};

export default Pedidos;