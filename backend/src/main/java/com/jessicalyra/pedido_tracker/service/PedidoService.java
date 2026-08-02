package com.jessicalyra.pedido_tracker.service;

import com.jessicalyra.pedido_tracker.model.Pedido;
import com.jessicalyra.pedido_tracker.repository.PedidoRepository;
import com.jessicalyra.pedido_tracker.exception.PedidoNotFoundException;
import org.springframework.stereotype.Service;

import com.jessicalyra.pedido_tracker.model.User;
import com.jessicalyra.pedido_tracker.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;


import java.util.List;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final UserRepository userRepository;

    public PedidoService(PedidoRepository pedidoRepository, UserRepository userRepository) {
        this.pedidoRepository = pedidoRepository;
        this.userRepository = userRepository;
    }

    public Pedido criar(Pedido pedido) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User usuario = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        pedido.setUsuario(usuario);

        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listarTodos() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User usuario = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return pedidoRepository.findByUsuario(usuario);
    }
    public Pedido buscarPorId(Long id) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User usuario = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return pedidoRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new PedidoNotFoundException("Pedido não encontrado"));
    }

    public Pedido atualizar(Long id, Pedido pedidoAtualizado) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User usuario = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Pedido pedido = pedidoRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new PedidoNotFoundException("Pedido não encontrado"));

        pedido.setNumero(pedidoAtualizado.getNumero());
        pedido.setDescricao(pedidoAtualizado.getDescricao());
        pedido.setStatus(pedidoAtualizado.getStatus());
        pedido.setDataCriacao(pedidoAtualizado.getDataCriacao());

        return pedidoRepository.save(pedido);
    }

    public void excluir(Long id) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User usuario = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Pedido pedido = pedidoRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new PedidoNotFoundException("Pedido não encontrado"));

        pedidoRepository.delete(pedido);
    }
}