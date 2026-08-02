package com.jessicalyra.pedido_tracker.service;

import com.jessicalyra.pedido_tracker.model.Pedido;
import com.jessicalyra.pedido_tracker.repository.PedidoRepository;
import com.jessicalyra.pedido_tracker.exception.PedidoNotFoundException;
import org.springframework.stereotype.Service;
import com.jessicalyra.pedido_tracker.dto.PedidoRequest;
import com.jessicalyra.pedido_tracker.dto.PedidoResponse;
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

    public PedidoResponse criar(PedidoRequest request) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User usuario = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Pedido pedido = new Pedido();

        pedido.setNumero(request.getNumero());
        pedido.setDescricao(request.getDescricao());
        pedido.setStatus(request.getStatus());
        pedido.setDataCriacao(request.getDataCriacao());
        pedido.setUsuario(usuario);

        Pedido pedidoSalvo = pedidoRepository.save(pedido);

        return new PedidoResponse(
                pedidoSalvo.getId(),
                pedidoSalvo.getNumero(),
                pedidoSalvo.getDescricao(),
                pedidoSalvo.getStatus(),
                pedidoSalvo.getDataCriacao()
        );
    }

    public List<PedidoResponse> listarTodos() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User usuario = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return pedidoRepository.findByUsuario(usuario)
                .stream()
                .map(pedido -> new PedidoResponse(
                        pedido.getId(),
                        pedido.getNumero(),
                        pedido.getDescricao(),
                        pedido.getStatus(),
                        pedido.getDataCriacao()
                ))
                .toList();
    }

    public PedidoResponse buscarPorId(Long id) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User usuario = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Pedido pedido = pedidoRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new PedidoNotFoundException("Pedido não encontrado"));

        return new PedidoResponse(
                pedido.getId(),
                pedido.getNumero(),
                pedido.getDescricao(),
                pedido.getStatus(),
                pedido.getDataCriacao()
        );
    }

   public PedidoResponse atualizar(Long id, PedidoRequest request) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User usuario = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Pedido pedido = pedidoRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new PedidoNotFoundException("Pedido não encontrado"));

        pedido.setNumero(request.getNumero());
        pedido.setDescricao(request.getDescricao());
        pedido.setStatus(request.getStatus());
        pedido.setDataCriacao(request.getDataCriacao());

        Pedido pedidoAtualizado = pedidoRepository.save(pedido);

        return new PedidoResponse(
                pedidoAtualizado.getId(),
                pedidoAtualizado.getNumero(),
                pedidoAtualizado.getDescricao(),
                pedidoAtualizado.getStatus(),
                pedidoAtualizado.getDataCriacao()
        );
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