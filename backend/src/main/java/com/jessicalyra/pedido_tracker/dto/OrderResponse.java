package com.jessicalyra.pedido_tracker.dto;

import com.jessicalyra.pedido_tracker.model.OrderStatus;

import java.util.List;

public class OrderResponse {

    private Long id;
    private String cliente;
    private String enderecoEntrega;
    private OrderStatus status;
    private List<OrderItemResponse> itens;

    public OrderResponse() {
    }

    public OrderResponse(
            Long id,
            String cliente,
            String enderecoEntrega,
            OrderStatus status,
            List<OrderItemResponse> itens
    ) {
        this.id = id;
        this.cliente = cliente;
        this.enderecoEntrega = enderecoEntrega;
        this.status = status;
        this.itens = itens;
    }

    public Long getId() {
        return id;
    }

    public String getCliente() {
        return cliente;
    }

    public String getEnderecoEntrega() {
        return enderecoEntrega;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public List<OrderItemResponse> getItens() {
        return itens;
    }
}