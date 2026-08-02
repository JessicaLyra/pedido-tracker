package com.jessicalyra.pedido_tracker.repository;

import com.jessicalyra.pedido_tracker.model.Pedido;
import com.jessicalyra.pedido_tracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuario(User usuario);

    Optional<Pedido> findByIdAndUsuario(Long id, User usuario);
}