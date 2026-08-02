package com.jessicalyra.pedido_tracker.exception;

public class PedidoNotFoundException extends RuntimeException {

    public PedidoNotFoundException(String message) {
        super(message);
    }
}