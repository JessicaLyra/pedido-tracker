package com.jessicalyra.pedido_tracker.repository;

import com.jessicalyra.pedido_tracker.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}