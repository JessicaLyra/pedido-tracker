package com.jessicalyra.pedido_tracker.controller;

import com.jessicalyra.pedido_tracker.dto.OrderRequest;
import com.jessicalyra.pedido_tracker.dto.OrderResponse;
import com.jessicalyra.pedido_tracker.model.OrderStatus;
import com.jessicalyra.pedido_tracker.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> criar(
            @Valid @RequestBody OrderRequest request
    ) {

        OrderResponse novoPedido = orderService.criar(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novoPedido);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> listarTodos() {

        return ResponseEntity.ok(
                orderService.listarTodos()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> buscarPorId(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                orderService.buscarPorId(id)
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> atualizarStatus(
            @PathVariable Long id,
            @RequestBody StatusRequest request
    ) {

        OrderResponse pedidoAtualizado =
                orderService.atualizarStatus(
                        id,
                        request.getStatus()
                );

        return ResponseEntity.ok(pedidoAtualizado);
    }

    public static class StatusRequest {

        private OrderStatus status;

        public StatusRequest() {
        }

        public OrderStatus getStatus() {
            return status;
        }

        public void setStatus(OrderStatus status) {
            this.status = status;
        }
    }
}