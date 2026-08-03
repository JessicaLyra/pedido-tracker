package com.jessicalyra.pedido_tracker.service;

import com.jessicalyra.pedido_tracker.dto.OrderItemRequest;
import com.jessicalyra.pedido_tracker.dto.OrderItemResponse;
import com.jessicalyra.pedido_tracker.dto.OrderRequest;
import com.jessicalyra.pedido_tracker.dto.OrderResponse;
import com.jessicalyra.pedido_tracker.model.Order;
import com.jessicalyra.pedido_tracker.model.OrderItem;
import com.jessicalyra.pedido_tracker.model.OrderStatus;
import com.jessicalyra.pedido_tracker.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public OrderResponse criar(OrderRequest request) {

        Order order = new Order();

        order.setCliente(request.getCliente());
        order.setEnderecoEntrega(request.getEnderecoEntrega());
        order.setStatus(OrderStatus.RECEBIDO);

        for (OrderItemRequest itemRequest : request.getItens()) {

            OrderItem item = new OrderItem();

            item.setNome(itemRequest.getNome());
            item.setQuantidade(itemRequest.getQuantidade());
            item.setPedido(order);

            order.getItens().add(item);
        }

        Order orderSalvo = orderRepository.save(order);

        return toResponse(orderSalvo);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> listarTodos() {

        return orderRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse buscarPorId(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Pedido não encontrado")
                );

        return toResponse(order);
    }

    @Transactional
    public OrderResponse atualizarStatus(Long id, OrderStatus novoStatus) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Pedido não encontrado")
                );

        order.setStatus(novoStatus);

        Order orderAtualizado = orderRepository.save(order);

        return toResponse(orderAtualizado);
    }

    private OrderResponse toResponse(Order order) {

        List<OrderItemResponse> itens = order.getItens()
                .stream()
                .map(item -> new OrderItemResponse(
                        item.getId(),
                        item.getNome(),
                        item.getQuantidade()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getCliente(),
                order.getEnderecoEntrega(),
                order.getStatus(),
                itens
        );
    }
}