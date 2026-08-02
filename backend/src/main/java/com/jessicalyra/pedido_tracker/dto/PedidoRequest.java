package com.jessicalyra.pedido_tracker.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class PedidoRequest {

    @NotBlank(message = "O número do pedido é obrigatório")
    private String numero;

    @NotBlank(message = "A descrição do pedido é obrigatória")
    private String descricao;

    @NotBlank(message = "O status do pedido é obrigatório")
    private String status;

    @NotNull(message = "A data de criação é obrigatória")
    private LocalDateTime dataCriacao;

    public PedidoRequest() {
    }

    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getDataCriacao() {
        return dataCriacao;
    }

    public void setDataCriacao(LocalDateTime dataCriacao) {
        this.dataCriacao = dataCriacao;
    }
}