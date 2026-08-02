package com.jessicalyra.pedido_tracker.dto;

public class OrderItemRequest {

    private String nome;
    private Integer quantidade;

    public OrderItemRequest() {
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
}