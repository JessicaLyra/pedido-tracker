package com.jessicalyra.pedido_tracker.dto;

import java.time.LocalDateTime;

public class PedidoResponse {

    private Long id;
    private String numero;
    private String descricao;
    private String status;
    private LocalDateTime dataCriacao;

    public PedidoResponse() {
    }

    public PedidoResponse(
            Long id,
            String numero,
            String descricao,
            String status,
            LocalDateTime dataCriacao
    ) {
        this.id = id;
        this.numero = numero;
        this.descricao = descricao;
        this.status = status;
        this.dataCriacao = dataCriacao;
    }

    public Long getId() {
        return id;
    }

    public String getNumero() {
        return numero;
    }

    public String getDescricao() {
        return descricao;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }
}