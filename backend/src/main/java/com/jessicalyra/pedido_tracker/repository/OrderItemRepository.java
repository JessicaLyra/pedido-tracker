package com.jessicalyra.pedido_tracker.repository;

import com.jessicalyra.pedido_tracker.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}