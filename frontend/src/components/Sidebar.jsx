import { NavLink, useNavigate } from "react-router-dom";

import {
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

function Sidebar({ mobileOpen, setMobileOpen }) {
  const navigate = useNavigate();

  function sair() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const links = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <DashboardOutlinedIcon />,
    },
    {
      label: "Pedidos",
      path: "/pedidos",
      icon: <Inventory2OutlinedIcon />,
    },
    {
      label: "Novo pedido",
      path: "/novo-pedido",
      icon: <AddOutlinedIcon />,
    },
  ];

  return (
    <>
      {/* BOTÃO MOBILE */}

      <IconButton
        onClick={() => setMobileOpen(true)}
        sx={{
            display: {
            xs: "flex",
            lg: "none",
            },
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1200,
            width: 42,
            height: 42,
            color: "#FFFFFF",
            backgroundColor: "#171717",
            borderRadius: "8px",

            "&:hover": {
            backgroundColor: "#262626",
            },
        }}
        >
        <MenuOutlinedIcon />
        </IconButton>

      {/* OVERLAY MOBILE */}

      {mobileOpen && (
        <Box
          onClick={() => setMobileOpen(false)}
          sx={{
            display: {
              xs: "block",
              lg: "none",
            },
            position: "fixed",
            inset: 0,
            zIndex: 1190,
            backgroundColor: "rgba(0,0,0,0.45)",
          }}
        />
      )}

      {/* SIDEBAR */}

      <Box
        component="aside"
        sx={{
          position: {
            xs: "fixed",
            lg: "fixed",
          },

          top: 0,
          left: {
            xs: mobileOpen ? 0 : "-280px",
            lg: 0,
          },

          width: 250,
          height: "100vh",

          zIndex: 1200,

          backgroundColor: "#111111",
          color: "#FFFFFF",

          display: "flex",
          flexDirection: "column",

          transition: "left 0.25s ease",

          borderRight: "1px solid #262626",
        }}
      >
        {/* LOGO */}

        <Box
          sx={{
            px: 3,
            py: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            component="img"
            src="/logo delivery tracker.png"
            alt="Delivery Tracker"
            sx={{
              width: 155,
              maxWidth: "100%",
              objectFit: "contain",
            }}
          />

          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{
              display: {
                xs: "flex",
                lg: "none",
              },
              color: "#A3A3A3",

              "&:hover": {
                color: "#FFFFFF",
                backgroundColor: "#262626",
              },
            }}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </Box>

        <Divider
          sx={{
            borderColor: "#262626",
          }}
        />

        {/* MENU */}

        <Stack
          component="nav"
          spacing={0.5}
          sx={{
            px: 1.5,
            py: 2,
          }}
        >
          {links.map((link) => (
            <Box
              key={link.path}
              component={NavLink}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,

                height: 44,
                px: 1.5,

                borderRadius: "7px",

                color: "#A3A3A3",
                textDecoration: "none",

                fontSize: 13,
                fontWeight: 500,

                transition: "all 0.15s ease",

                "& svg": {
                  fontSize: 20,
                },

                "&:hover": {
                  color: "#FFFFFF",
                  backgroundColor: "#1F1F1F",
                },

                "&.active": {
                  color: "#FFFFFF",
                  backgroundColor: "#252525",
                  fontWeight: 600,

                  "& svg": {
                    color: "#FF7800",
                  },
                },
              }}
            >
              {link.icon}

              <Typography
                component="span"
                sx={{
                  fontSize: 13,
                  fontWeight: "inherit",
                  color: "inherit",
                }}
              >
                {link.label}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* ESPAÇO */}

        <Box sx={{ flex: 1 }} />

{/* USUÁRIO / SAIR */}

        <Box
        sx={{
            px: 2,
            pb: 2,
        }}
        >
        <Divider
            sx={{
            mb: 2,
            borderColor: "#262626",
            }}
        />

        <Box
            component="button"
            onClick={sair}
            sx={{
            width: "100%",
            border: 0,
            background: "transparent",

            display: "flex",
            alignItems: "center",
            gap: 1.5,

            px: 1.5,
            height: 44,

            borderRadius: "7px",

            color: "#A3A3A3",
            cursor: "pointer",

            fontFamily: "inherit",

            "&:hover": {
                color: "#FFFFFF",
                backgroundColor: "#1F1F1F",
            },
            }}
        >
            <LogoutOutlinedIcon
            sx={{
                fontSize: 20,
            }}
            />

            <Typography
            component="span"
            sx={{
                fontSize: 13,
                color: "inherit",
            }}
            >
            Sair
            </Typography>
        </Box>

        {/* COPYRIGHT */}

        <Typography
            sx={{
            mt: 2,
            px: 1.5,
            fontSize: 10,
            color: "#525252",
            lineHeight: 1.4,
            }}
        >
            © {new Date().getFullYear()} Delivery Tracker
        </Typography>
        </Box>
        
      </Box>
    </>
  );
}

export default Sidebar;