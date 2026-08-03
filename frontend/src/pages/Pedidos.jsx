import { useEffect, useState } from "react";
import api from "../services/api";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

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
      RECEBIDO: "info",
      EM_PREPARO: "warning",
      SAIU_PARA_ENTREGA: "secondary",
      ENTREGUE: "success",
      CANCELADO: "error",
    };

    return cores[status] || "default";
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
        py: 5,
      }}
    >
      <Container maxWidth="lg">

        {/* Cabeçalho */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={4}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
              color="text.primary"
            >
              Pedidos
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              mt={0.5}
            >
              Acompanhe e gerencie os pedidos da operação.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={carregarPedidos}
            disabled={carregando}
          >
            Atualizar pedidos
          </Button>
        </Stack>

        {/* Carregando */}
        {carregando && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={8}
          >
            <CircularProgress />
          </Box>
        )}

        {/* Erro */}
        {!carregando && erro && (
          <Alert severity="error">
            {erro}
          </Alert>
        )}

        {/* Nenhum pedido */}
        {!carregando && !erro && pedidos.length === 0 && (
          <Card>
            <CardContent>
              <Typography
                align="center"
                color="text.secondary"
                py={4}
              >
                Nenhum pedido encontrado.
              </Typography>
            </CardContent>
          </Card>
        )}

        {/* Lista de pedidos */}
        {!carregando && !erro && pedidos.length > 0 && (
          <Grid container spacing={3}>
            {pedidos.map((pedido) => (
              <Grid
                item
                xs={12}
                md={6}
                lg={4}
                key={pedido.id}
              >
                <Card
                  elevation={2}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                  }}
                >
                  <CardContent>

                    {/* Cabeçalho do card */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography
                        variant="h6"
                        fontWeight={700}
                      >
                        Pedido #{pedido.id}
                      </Typography>

                      <Chip
                        label={formatarStatus(pedido.status)}
                        color={corStatus(pedido.status)}
                        size="small"
                      />
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    {/* Cliente */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Cliente
                    </Typography>

                    <Typography
                      variant="body1"
                      fontWeight={600}
                      mb={2}
                    >
                      {pedido.cliente}
                    </Typography>

                    {/* Endereço */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Endereço de entrega
                    </Typography>

                    <Typography
                      variant="body1"
                      mb={2}
                    >
                      {pedido.enderecoEntrega}
                    </Typography>

                    {/* Itens */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      mb={1}
                    >
                      Itens
                    </Typography>

                    <Stack spacing={0.5}>
                      {pedido.itens?.map((item) => (
                        <Stack
                          key={item.id}
                          direction="row"
                          justifyContent="space-between"
                        >
                          <Typography variant="body2">
                            {item.nome}
                          </Typography>

                          <Typography
                            variant="body2"
                            fontWeight={600}
                          >
                            {item.quantidade}x
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>

                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

      </Container>
    </Box>
  );
}

export default Pedidos;