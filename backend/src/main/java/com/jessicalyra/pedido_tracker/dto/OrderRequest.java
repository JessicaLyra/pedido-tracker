package com.jessicalyra.pedido_tracker.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class OrderRequest {

    @NotBlank(message = "O cliente é obrigatório")
    private String cliente;

    @NotBlank(message = "O endereço de entrega é obrigatório")
    private String enderecoEntrega;

    @NotEmpty(message = "O pedido deve possuir pelo menos um item")
    @Valid
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