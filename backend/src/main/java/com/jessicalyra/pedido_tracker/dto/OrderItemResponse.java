package com.jessicalyra.pedido_tracker.dto;

public class OrderItemResponse {

    private Long id;
    private String nome;
    private Integer quantidade;

    public OrderItemResponse() {
    }

    public OrderItemResponse(Long id, String nome, Integer quantidade) {
        this.id = id;
        this.nome = nome;
        this.quantidade = quantidade;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public Integer getQuantidade() {
        return quantidade;
    }
}