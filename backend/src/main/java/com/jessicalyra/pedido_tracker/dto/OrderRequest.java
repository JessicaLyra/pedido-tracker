package com.jessicalyra.pedido_tracker.dto;

import java.util.List;

public class OrderRequest {

    private String cliente;
    private String enderecoEntrega;
    private List<OrderItemRequest> itens;

    public OrderRequest() {
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public String getEnderecoEntrega() {
        return enderecoEntrega;
    }

    public void setEnderecoEntrega(String enderecoEntrega) {
        this.enderecoEntrega = enderecoEntrega;
    }

    public List<OrderItemRequest> getItens() {
        return itens;
    }

    public void setItens(List<OrderItemRequest> itens) {
        this.itens = itens;
    }
}