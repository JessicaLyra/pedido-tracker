import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { PieChart } from "@mui/x-charts/PieChart";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";

function Dashboard() {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [alterandoStatus, setAlterandoStatus] = useState(null);

  // =====================================================
  // CARREGAR PEDIDOS
  // =====================================================

  useEffect(() => {
    carregarPedidos();
  }, []);

  async function carregarPedidos() {
    try {
      setCarregando(true);

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
      console.error("Erro ao carregar dashboard:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        navigate("/login");
      }
    } finally {
      setCarregando(false);
    }
  }

  // =====================================================
  // ALTERAR STATUS
  // =====================================================

  async function alterarStatus(id, novoStatus) {
    try {
      setAlterandoStatus(id);

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
    } catch (error) {
      console.error("Erro ao alterar status:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");

        navigate("/login");
      }
    } finally {
      setAlterandoStatus(null);
    }
  }

  // =====================================================
  // CONTADORES
  // =====================================================

  const total = pedidos.length;

  const recebidos = pedidos.filter(
    (pedido) => pedido.status === "RECEBIDO"
  ).length;

  const emPreparo = pedidos.filter(
    (pedido) => pedido.status === "EM_PREPARO"
  ).length;

  const saiuParaEntrega = pedidos.filter(
    (pedido) => pedido.status === "SAIU_PARA_ENTREGA"
  ).length;

  const entregues = pedidos.filter(
    (pedido) => pedido.status === "ENTREGUE"
  ).length;

  const cancelados = pedidos.filter(
    (pedido) => pedido.status === "CANCELADO"
  ).length;

  const pedidosEmAndamento = pedidos.filter(
    (pedido) =>
      pedido.status !== "ENTREGUE" &&
      pedido.status !== "CANCELADO"
  );

  // =====================================================
  // FORMATAÇÃO DO STATUS
  // =====================================================

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

  // =====================================================
  // ESTILO DOS STATUS
  // =====================================================

  function estiloStatus(status) {
    const estilos = {
      RECEBIDO: {
        cor: "#7C3AED",
        fundo: "#F5F3FF",
        borda: "#DDD6FE",
        forte: "#6D28D9",
      },

      EM_PREPARO: {
        cor: "#D97706",
        fundo: "#FFFBEB",
        borda: "#FDE68A",
        forte: "#B45309",
      },

      SAIU_PARA_ENTREGA: {
        cor: "#2563EB",
        fundo: "#EFF6FF",
        borda: "#BFDBFE",
        forte: "#1D4ED8",
      },

      ENTREGUE: {
        cor: "#16A34A",
        fundo: "#F0FDF4",
        borda: "#BBF7D0",
        forte: "#15803D",
      },

      CANCELADO: {
        cor: "#DC2626",
        fundo: "#FEF2F2",
        borda: "#FECACA",
        forte: "#B91C1C",
      },
    };

    return (
      estilos[status] || {
        cor: "#737373",
        fundo: "#F5F5F5",
        borda: "#E5E5E5",
        forte: "#525252",
      }
    );
  }

  // =====================================================
  // PRÓXIMO STATUS
  // =====================================================

  function obterProximoStatus(status) {
    const proximos = {
      RECEBIDO: "EM_PREPARO",
      EM_PREPARO: "SAIU_PARA_ENTREGA",
      SAIU_PARA_ENTREGA: "ENTREGUE",
    };

    return proximos[status] || null;
  }

  // =====================================================
  // TEXTO DO BOTÃO
  // =====================================================

  function textoProximoStatus(status) {
    const textos = {
      RECEBIDO: "Iniciar preparo",
      EM_PREPARO: "Enviar para entrega",
      SAIU_PARA_ENTREGA: "Marcar como entregue",
    };

    return textos[status] || "Atualizar status";
  }

  // =====================================================
  // ÍCONE DO BOTÃO
  // =====================================================

  function iconeProximoStatus(status) {
    if (status === "SAIU_PARA_ENTREGA") {
      return <DoneOutlinedIcon />;
    }

    if (status === "EM_PREPARO") {
      return <LocalShippingOutlinedIcon />;
    }

    return <PlayArrowOutlinedIcon />;
  }

  // =====================================================
  // PRÓXIMO PEDIDO
  // =====================================================

  const proximoPedido = useMemo(() => {
    const ordem = {
      RECEBIDO: 1,
      EM_PREPARO: 2,
      SAIU_PARA_ENTREGA: 3,
    };

    return [...pedidosEmAndamento].sort(
      (a, b) =>
        (ordem[a.status] || 99) - (ordem[b.status] || 99)
    )[0];
  }, [pedidosEmAndamento]);

  const proximaAcao = proximoPedido
    ? obterProximoStatus(proximoPedido.status)
    : null;

  // =====================================================
  // ETAPAS DO FLUXO
  // =====================================================

  const etapas = [
    {
      status: "RECEBIDO",
      titulo: "Recebido",
      descricao: "Aguardando preparo",
      quantidade: recebidos,
      icon: <Inventory2OutlinedIcon />,
    },
    {
      status: "EM_PREPARO",
      titulo: "Em preparo",
      descricao: "Pedido sendo preparado",
      quantidade: emPreparo,
      icon: <RestaurantOutlinedIcon />,
    },
    {
      status: "SAIU_PARA_ENTREGA",
      titulo: "Em entrega",
      descricao: "Pedido a caminho",
      quantidade: saiuParaEntrega,
      icon: <LocalShippingOutlinedIcon />,
    },
    {
      status: "ENTREGUE",
      titulo: "Entregue",
      descricao: "Pedido finalizado",
      quantidade: entregues,
      icon: <CheckCircleOutlineOutlinedIcon />,
    },
  ];

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        overflowX: "hidden",
        backgroundColor: "#FFFFFF",
      }}
    >
      <Box
        component="main"
        sx={{
          width: "100%",
          minHeight: "100vh",
          boxSizing: "border-box",

          px: {
            xs: 1.5,
            sm: 3,
            md: 5,
            lg: 6,
          },

          py: {
            xs: 3,
            sm: 5,
            lg: 5,
          },
        }}
      >
        {/* =====================================================
            CABEÇALHO
        ====================================================== */}

        <Box
          sx={{
            mb: {
              xs: 2.5,
              md: 4,
            },
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: 23,
                sm: 25,
                md: 28,
              },

              fontWeight: 700,
              color: "#171717",

              letterSpacing: "-0.7px",
              lineHeight: 1.2,
            }}
          >
            Olá, {usuario?.nome || "usuário"} 👋
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              fontSize: 13,
              color: "#737373",
            }}
          >
            Aqui está o resumo da sua operação.
          </Typography>
        </Box>

        {/* =====================================================
            CARREGAMENTO
        ====================================================== */}

        {carregando ? (
          <Box
            sx={{
              minHeight: 300,
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
        ) : (
          <>
            {/* =================================================
                FLUXO DA OPERAÇÃO
            ================================================== */}

            <Box
              sx={{
                mb: 3,

                border: "1px solid #E8E8E8",
                borderRadius: "14px",

                background:
                  "linear-gradient(135deg, #FFFFFF 0%, #FFFDFB 100%)",

                overflow: "hidden",

                boxShadow:
                  "0 4px 20px rgba(0,0,0,0.035)",
              }}
            >
              {/* CABEÇALHO */}

              <Box
                sx={{
                  px: {
                    xs: 2,
                    sm: 2.5,
                  },

                  py: {
                    xs: 1.8,
                    sm: 2,
                  },

                  borderBottom:
                    "1px solid #F0F0F0",

                  display: "flex",

                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },

                  justifyContent:
                    "space-between",

                  alignItems: {
                    xs: "flex-start",
                    sm: "center",
                  },

                  gap: 1.5,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Box
                    sx={{
                      width: 30,
                      height: 30,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      borderRadius: "8px",

                      color: "#FF7800",
                      backgroundColor: "#FFF7ED",
                    }}
                  >
                    <BoltOutlinedIcon
                      sx={{
                        fontSize: 18,
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#171717",
                      }}
                    >
                      Fluxo da operação
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.2,
                        fontSize: 11,
                        color: "#737373",
                      }}
                    >
                      Acompanhe as etapas dos pedidos.
                    </Typography>
                  </Box>
                </Stack>

                <Box
                  sx={{
                    px: 1.2,
                    py: 0.65,

                    borderRadius: "8px",

                    backgroundColor:
                      pedidosEmAndamento.length > 0
                        ? "#FFF7ED"
                        : "#F0FDF4",

                    border:
                      pedidosEmAndamento.length > 0
                        ? "1px solid #FED7AA"
                        : "1px solid #BBF7D0",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,

                      color:
                        pedidosEmAndamento.length > 0
                          ? "#C2410C"
                          : "#15803D",
                    }}
                  >
                    {pedidosEmAndamento.length > 0
                      ? `${pedidosEmAndamento.length} ${
                          pedidosEmAndamento.length === 1
                            ? "pedido em andamento"
                            : "pedidos em andamento"
                        }`
                      : "Operação em dia"}
                  </Typography>
                </Box>
              </Box>

              {/* ETAPAS */}

              <Box
                sx={{
                  px: {
                    xs: 1.5,
                    sm: 2.5,
                  },

                  py: {
                    xs: 2,
                    sm: 2.5,
                  },

                  overflowX: {
                    xs: "auto",
                    sm: "visible",
                  },

                  "&::-webkit-scrollbar": {
                    height: 4,
                  },

                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#D4D4D4",
                    borderRadius: 10,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "stretch",

                    minWidth: {
                      xs: 620,
                      sm: "100%",
                    },
                  }}
                >
                  {etapas.map((etapa, index) => {
                    const status = estiloStatus(
                      etapa.status
                    );

                    const isUltima =
                      index === etapas.length - 1;

                    const isAtual =
                      pedidosEmAndamento.some(
                        (pedido) =>
                          pedido.status === etapa.status
                      );

                    return (
                      <Box
                        key={etapa.status}
                        sx={{
                          flex: 1,

                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {/* CARD DA ETAPA */}

                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 0,

                            position: "relative",

                            display: "flex",
                            alignItems: "center",

                            gap: 1.2,

                            px: {
                              xs: 1,
                              sm: 1.3,
                            },

                            py: 1.4,

                            borderRadius: "12px",

                            backgroundColor: isAtual
                              ? "#FFFFFF"
                              : "#FAFAFA",

                            border: isAtual
                              ? `1px solid ${status.borda}`
                              : "1px solid #EEEEEE",

                            boxShadow: isAtual
                              ? `0 3px 10px ${status.borda}55`
                              : "none",

                            transition:
                              "all 0.2s ease",

                            "&:hover": {
                              transform:
                                "translateY(-1px)",

                              borderColor:
                                status.borda,

                              boxShadow:
                                `0 4px 12px ${status.borda}45`,
                            },
                          }}
                        >
                          {/* ÍCONE */}

                          <Box
                            sx={{
                              flexShrink: 0,

                              width: 38,
                              height: 38,

                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",

                              borderRadius: "50%",

                              color: isAtual
                                ? "#FFFFFF"
                                : "#A3A3A3",

                              backgroundColor: isAtual
                                ? status.cor
                                : "#F3F3F3",

                              border: isAtual
                                ? "none"
                                : "1px solid #E5E5E5",

                              boxShadow: isAtual
                                ? `0 4px 10px ${status.cor}35`
                                : "none",

                              "& svg": {
                                fontSize: 19,
                              },
                            }}
                          >
                            {etapa.icon}
                          </Box>

                          {/* TEXTOS */}

                          <Box
                            sx={{
                              minWidth: 0,
                              flex: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: 11,
                                fontWeight: 700,

                                color: isAtual
                                  ? status.forte
                                  : "#525252",

                                whiteSpace: "nowrap",
                              }}
                            >
                              {etapa.titulo}
                            </Typography>

                            <Typography
                              sx={{
                                mt: 0.2,

                                fontSize: 9.5,
                                color: "#737373",

                                whiteSpace: "nowrap",
                              }}
                            >
                              {etapa.descricao}
                            </Typography>
                          </Box>

                          {/* QUANTIDADE */}

                          <Box
                            sx={{
                              flexShrink: 0,

                              minWidth: 28,
                              height: 28,

                              px: 0.8,

                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",

                              borderRadius: "50%",

                              backgroundColor: isAtual
                                ? status.fundo
                                : "#F3F3F3",

                              color: isAtual
                                ? status.forte
                                : "#737373",

                              fontSize: 11,
                              fontWeight: 800,

                              border: isAtual
                                ? `1px solid ${status.borda}`
                                : "1px solid #E5E5E5",
                            }}
                          >
                            {etapa.quantidade}
                          </Box>
                        </Box>

                        {/* SETA */}

                        {!isUltima && (
                          <ChevronRightOutlinedIcon
                            sx={{
                              flexShrink: 0,

                              mx: {
                                xs: 0.3,
                                sm: 0.7,
                              },

                              color: "#D4D4D4",
                              fontSize: 20,
                            }}
                          />
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              {/* PRÓXIMA TAREFA */}

              {proximoPedido && proximaAcao && (
                <Box
                  sx={{
                    mx: {
                      xs: 1.5,
                      sm: 2.5,
                    },

                    mb: {
                      xs: 1.5,
                      sm: 2.5,
                    },

                    p: {
                      xs: 1.5,
                      sm: 1.8,
                    },

                    borderRadius: "10px",

                    backgroundColor: "#171717",

                    display: "flex",

                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },

                    alignItems: {
                      xs: "stretch",
                      sm: "center",
                    },

                    justifyContent:
                      "space-between",

                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Stack
                      direction="row"
                      spacing={0.8}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 7,
                          height: 7,

                          borderRadius: "50%",

                          backgroundColor:
                            "#FF7800",

                          boxShadow:
                            "0 0 0 4px rgba(255,120,0,0.12)",
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: 10,
                          fontWeight: 700,

                          color: "#FFB36B",

                          textTransform:
                            "uppercase",

                          letterSpacing: "0.5px",
                        }}
                      >
                        Próxima tarefa
                      </Typography>
                    </Stack>

                    <Typography
                      sx={{
                        mt: 0.6,

                        fontSize: {
                          xs: 13,
                          sm: 14,
                        },

                        fontWeight: 600,
                        color: "#FFFFFF",
                      }}
                    >
                      Pedido #{proximoPedido.id} ·{" "}
                      {textoProximoStatus(
                        proximoPedido.status
                      )}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.25,

                        fontSize: 11,
                        color: "#A3A3A3",
                      }}
                    >
                      {proximoPedido.cliente}
                    </Typography>
                  </Box>

                  <Button
                    disabled={
                      alterandoStatus ===
                      proximoPedido.id
                    }
                    startIcon={
                      alterandoStatus ===
                      proximoPedido.id ? (
                        <CircularProgress
                          size={15}
                          sx={{
                            color: "#FFFFFF",
                          }}
                        />
                      ) : (
                        iconeProximoStatus(
                          proximoPedido.status
                        )
                      )
                    }
                    endIcon={
                      alterandoStatus !==
                        proximoPedido.id && (
                        <ArrowForwardOutlinedIcon
                          sx={{
                            fontSize: 16,
                          }}
                        />
                      )
                    }
                    onClick={() =>
                      alterarStatus(
                        proximoPedido.id,
                        proximaAcao
                      )
                    }
                    sx={{
                      minHeight: 40,

                      width: {
                        xs: "100%",
                        sm: "auto",
                      },

                      px: 1.8,

                      borderRadius: "8px",

                      textTransform: "none",

                      fontSize: 11.5,
                      fontWeight: 700,

                      color: "#FFFFFF",

                      backgroundColor:
                        "#FF7800",

                      "&:hover": {
                        backgroundColor:
                          "#E96800",
                      },

                      "&.Mui-disabled": {
                        color: "#FFFFFF",
                        backgroundColor:
                          "#525252",
                      },
                    }}
                  >
                    {alterandoStatus ===
                    proximoPedido.id
                      ? "Salvando..."
                      : textoProximoStatus(
                          proximoPedido.status
                        )}
                  </Button>
                </Box>
              )}
            </Box>

            {/* =================================================
                FILA + GRÁFICO
            ================================================== */}

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  lg: "minmax(0, 1.45fr) minmax(340px, 0.75fr)",
                },

                gap: {
                  xs: 2.5,
                  lg: 3,
                },

                alignItems: "start",
              }}
            >
              {/* =================================================
                  FILA DE PEDIDOS
              ================================================== */}

              <Box
                sx={{
                  border:
                    "1px solid #E8E8E8",

                  borderRadius: "12px",

                  backgroundColor:
                    "#FFFFFF",

                  overflow: "hidden",
                }}
              >
                {/* CABEÇALHO */}

                <Box
                  sx={{
                    px: {
                      xs: 1.8,
                      sm: 2.5,
                    },

                    py: 2,

                    borderBottom:
                      "1px solid #E5E5E5",

                    display: "flex",

                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },

                    justifyContent:
                      "space-between",

                    alignItems: {
                      xs: "flex-start",
                      sm: "center",
                    },

                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,

                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",

                          borderRadius: "8px",

                          backgroundColor:
                            "#FFF7ED",

                          color: "#FF7800",
                        }}
                      >
                        <ScheduleOutlinedIcon
                          sx={{
                            fontSize: 18,
                          }}
                        />
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "#171717",
                          }}
                        >
                          Fila de pedidos
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.3,
                            fontSize: 12,
                            color: "#737373",
                          }}
                        >
                          Pedidos que ainda precisam de ação.
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        px: 1,
                        py: 0.5,

                        borderRadius: "999px",

                        backgroundColor:
                          pedidosEmAndamento.length >
                          0
                            ? "#FFF7ED"
                            : "#F0FDF4",

                        color:
                          pedidosEmAndamento.length >
                          0
                            ? "#C2410C"
                            : "#15803D",

                        fontSize: 10.5,
                        fontWeight: 700,
                      }}
                    >
                      {pedidosEmAndamento.length}{" "}
                      {pedidosEmAndamento.length === 1
                        ? "pedido"
                        : "pedidos"}
                    </Box>

                    <Button
                      onClick={() =>
                        navigate("/pedidos")
                      }
                      endIcon={
                        <ArrowForwardOutlinedIcon
                          sx={{
                            fontSize: 16,
                          }}
                        />
                      }
                      sx={{
                        minHeight: 34,

                        px: 1.3,

                        borderRadius: "7px",

                        border:
                          "1px solid #FED7AA",

                        color: "#C2410C",

                        backgroundColor:
                          "#FFF7ED",

                        textTransform:
                          "none",

                        fontSize: 11.5,

                        fontWeight: 700,

                        "&:hover": {
                          borderColor:
                            "#FFB36B",

                          backgroundColor:
                            "#FFF3E8",

                          color: "#B45309",
                        },
                      }}
                    >
                      Ver todos
                    </Button>
                  </Box>
                </Box>

                {/* LISTA */}

                {pedidosEmAndamento.length ===
                0 ? (
                  <Box
                    sx={{
                      py: 7,
                      px: 2,

                      textAlign: "center",
                    }}
                  >
                    <CheckCircleOutlineOutlinedIcon
                      sx={{
                        fontSize: 34,
                        color: "#16A34A",
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
                      Tudo em dia!
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: 12,
                        color: "#737373",
                      }}
                    >
                      Não existem pedidos aguardando ação.
                    </Typography>
                  </Box>
                ) : (
                  <Stack spacing={0}>
                    {pedidosEmAndamento.map(
                      (pedido) => {
                        const status =
                          estiloStatus(
                            pedido.status
                          );

                        const proximoStatus =
                          obterProximoStatus(
                            pedido.status
                          );

                        const estaAlterando =
                          alterandoStatus ===
                          pedido.id;

                        return (
                          <Box
                            key={pedido.id}
                            sx={{
                              px: {
                                xs: 1.8,
                                sm: 2.5,
                              },

                              py: {
                                xs: 1.8,
                                sm: 2,
                              },

                              borderBottom:
                                "1px solid #E5E5E5",

                              "&:last-child": {
                                borderBottom:
                                  "none",
                              },

                              transition:
                                "background-color 0.15s ease",

                              "&:hover": {
                                backgroundColor:
                                  "#FCFCFC",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "grid",

                                gridTemplateColumns:
                                  {
                                    xs: "1fr",
                                    md: "55px minmax(0, 1fr) 190px",
                                  },

                                gap: {
                                  xs: 1.5,
                                  md: 2,
                                },

                                alignItems:
                                  "center",
                              }}
                            >
                              {/* ID */}

                              <Typography
                                sx={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color:
                                    "#171717",
                                }}
                              >
                                #{pedido.id}
                              </Typography>

                              {/* INFORMAÇÕES */}

                              <Box
                                sx={{
                                  minWidth: 0,
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: 14,
                                    fontWeight: 600,
                                    color:
                                      "#262626",

                                    overflow:
                                      "hidden",

                                    textOverflow:
                                      "ellipsis",

                                    whiteSpace:
                                      "nowrap",
                                  }}
                                >
                                  {
                                    pedido.cliente
                                  }
                                </Typography>

                                <Typography
                                  sx={{
                                    mt: 0.35,

                                    fontSize: 11,
                                    color:
                                      "#737373",

                                    overflow:
                                      "hidden",

                                    textOverflow:
                                      "ellipsis",

                                    whiteSpace:
                                      "nowrap",
                                  }}
                                >
                                  {
                                    pedido.enderecoEntrega
                                  }
                                </Typography>

                                {pedido.itens
                                  ?.length >
                                  0 && (
                                  <Typography
                                    sx={{
                                      mt: 0.35,

                                      fontSize: 11,
                                      color:
                                        "#A3A3A3",

                                      overflow:
                                        "hidden",

                                      textOverflow:
                                        "ellipsis",

                                      whiteSpace:
                                        "nowrap",
                                    }}
                                  >
                                    {pedido.itens
                                      .map(
                                        (
                                          item
                                        ) =>
                                          `${item.quantidade}x ${item.nome}`
                                      )
                                      .join(
                                        " • "
                                      )}
                                  </Typography>
                                )}
                              </Box>

                              {/* STATUS + AÇÃO */}

                              <Stack
                                spacing={1}
                                sx={{
                                  width:
                                    "100%",
                                }}
                              >
                                {/* STATUS */}

                                <Box
                                  sx={{
                                    display:
                                      "flex",

                                    justifyContent:
                                      {
                                        xs: "flex-start",
                                        md: "flex-end",
                                      },
                                  }}
                                >
                                  <Box
                                    sx={{
                                      display:
                                        "inline-flex",

                                      alignItems:
                                        "center",

                                      gap: 0.7,

                                      px: 1,
                                      height: 25,

                                      borderRadius:
                                        "999px",

                                      backgroundColor:
                                        status.fundo,

                                      color:
                                        status.cor,

                                      border: "none",

                                      boxShadow:
                                        `inset 0 0 0 1px ${status.borda}`,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        width: 6,
                                        height: 6,

                                        borderRadius:
                                          "50%",

                                        backgroundColor:
                                          status.cor,

                                        boxShadow:
                                          `0 0 0 3px ${status.borda}`,
                                      }}
                                    />

                                    <Typography
                                      sx={{
                                        fontSize:
                                          10.5,

                                        fontWeight:
                                          700,

                                        color:
                                          status.cor,

                                        whiteSpace:
                                          "nowrap",
                                      }}
                                    >
                                      {formatarStatus(
                                        pedido.status
                                      )}
                                    </Typography>
                                  </Box>
                                </Box>

                                {/* BOTÃO DE AÇÃO */}

                                {proximoStatus && (
                                  <Button
                                    fullWidth
                                    variant="outlined"
                                    disabled={
                                      estaAlterando
                                    }
                                    startIcon={
                                      estaAlterando ? (
                                        <CircularProgress
                                          size={
                                            15
                                          }
                                          sx={{
                                            color:
                                              "#FF7800",
                                          }}
                                        />
                                      ) : (
                                        <Box
                                          sx={{
                                            width: 24,
                                            height: 24,

                                            display:
                                              "flex",

                                            alignItems:
                                              "center",

                                            justifyContent:
                                              "center",

                                            borderRadius:
                                              "6px",

                                            backgroundColor:
                                              "#FFF7ED",

                                            color:
                                              "#FF7800",

                                            "& svg":
                                              {
                                                fontSize:
                                                  15,
                                              },
                                          }}
                                        >
                                          {iconeProximoStatus(
                                            pedido.status
                                          )}
                                        </Box>
                                      )
                                    }
                                    onClick={() =>
                                      alterarStatus(
                                        pedido.id,
                                        proximoStatus
                                      )
                                    }
                                    sx={{
                                      minHeight:
                                        {
                                          xs: 42,
                                          md: 38,
                                        },

                                      borderRadius:
                                        "8px",

                                      border:
                                        "1px solid #E5E5E5",

                                      color:
                                        "#262626",

                                      backgroundColor:
                                        "#FFFFFF",

                                      textTransform:
                                        "none",

                                      fontSize: 12,

                                      fontWeight:
                                        700,

                                      whiteSpace:
                                        "nowrap",

                                      boxShadow:
                                        "0 1px 2px rgba(0,0,0,0.04)",

                                      transition:
                                        "all 0.18s ease",

                                      "&:hover":
                                        {
                                          borderColor:
                                            "#FF7800",

                                          backgroundColor:
                                            "#FFF7ED",

                                          color:
                                            "#C2410C",

                                          boxShadow:
                                            "0 3px 8px rgba(255,120,0,0.12)",

                                          transform:
                                            "translateY(-1px)",
                                        },

                                      "&.Mui-disabled":
                                        {
                                          borderColor:
                                            "#E5E5E5",

                                          color:
                                            "#A3A3A3",

                                          backgroundColor:
                                            "#FAFAFA",
                                        },
                                    }}
                                  >
                                    {estaAlterando
                                      ? "Salvando..."
                                      : textoProximoStatus(
                                          pedido.status
                                        )}
                                  </Button>
                                )}
                              </Stack>
                            </Box>
                          </Box>
                        );
                      }
                    )}
                  </Stack>
                )}
              </Box>

              {/* =================================================
                  GRÁFICO
              ================================================== */}

              <Box
                sx={{
                  border:
                    "1px solid #E8E8E8",

                  borderRadius: "12px",

                  backgroundColor:
                    "#FFFFFF",

                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    px: 2.5,
                    py: 2,

                    borderBottom:
                      "1px solid #E5E5E5",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#171717",
                    }}
                  >
                    Status dos pedidos
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.4,
                      fontSize: 12,
                      color: "#737373",
                    }}
                  >
                    Distribuição dos pedidos por status.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    px: {
                      xs: 1,
                      sm: 2,
                    },

                    py: 2,

                    display: "flex",
                    justifyContent:
                      "center",
                    alignItems: "center",
                  }}
                >
                  {total === 0 ? (
                    <Box
                      sx={{
                        py: 8,
                        textAlign:
                          "center",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 13,
                          color:
                            "#737373",
                        }}
                      >
                        Nenhum pedido cadastrado.
                      </Typography>
                    </Box>
                  ) : (
                    <PieChart
                      height={300}
                      series={[
                        {
                          data: [
                            {
                              id: "recebidos",
                              value:
                                recebidos,
                              label:
                                "Recebidos",
                              color:
                                "#7C3AED",
                            },

                            {
                              id: "em-preparo",
                              value:
                                emPreparo,
                              label:
                                "Em preparo",
                              color:
                                "#D97706",
                            },

                            {
                              id: "em-entrega",
                              value:
                                saiuParaEntrega,
                              label:
                                "Em entrega",
                              color:
                                "#2563EB",
                            },

                            {
                              id: "entregues",
                              value:
                                entregues,
                              label:
                                "Entregues",
                              color:
                                "#16A34A",
                            },

                            {
                              id: "cancelados",
                              value:
                                cancelados,
                              label:
                                "Cancelados",
                              color:
                                "#DC2626",
                            },
                          ],

                          innerRadius: 58,
                          outerRadius: 92,

                          paddingAngle: 2,
                          cornerRadius: 4,

                          highlightScope: {
                            faded:
                              "global",
                            highlighted:
                              "item",
                          },

                          faded: {
                            innerRadius: 52,
                            additionalRadius:
                              -4,
                            color: "gray",
                          },
                        },
                      ]}
                      slotProps={{
                        legend: {
                          direction: "row",

                          position: {
                            vertical:
                              "bottom",
                            horizontal:
                              "middle",
                          },

                          padding: 0,

                          itemMarkWidth: 8,
                          itemMarkHeight: 8,

                          markGap: 6,
                          itemGap: 16,
                        },
                      }}
                      sx={{
                        "& .MuiChartsLegend-label":
                          {
                            fontSize: 11,
                            fill: "#525252",
                          },

                        "& .MuiChartsLegend-mark":
                          {
                            rx: 4,
                          },
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default Dashboard;
