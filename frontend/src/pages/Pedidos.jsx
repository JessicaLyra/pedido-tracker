import { useEffect, useState } from "react";
import api from "../services/api";

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

  return (
    <div>
      <h1>Pedidos</h1>

      <button onClick={carregarPedidos}>
        Atualizar pedidos
      </button>

      {carregando && <p>Carregando pedidos...</p>}

      {erro && <p>{erro}</p>}

      {!carregando && !erro && pedidos.length === 0 && (
        <p>Nenhum pedido encontrado.</p>
      )}

      {!carregando &&
        pedidos.map((pedido) => (
          <div key={pedido.id}>
            <h2>Pedido #{pedido.id}</h2>

            <p>
              <strong>Cliente:</strong> {pedido.cliente}
            </p>

            <p>
              <strong>Endereço:</strong> {pedido.enderecoEntrega}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {formatarStatus(pedido.status)}
            </p>

            <h3>Itens</h3>

            <ul>
              {pedido.itens?.map((item) => (
                <li key={item.id}>
                  {item.nome} — {item.quantidade}x
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

export default Pedidos;