package com.jessicalyra.pedido_tracker.controller;
import com.jessicalyra.pedido_tracker.dto.PedidoRequest;
import com.jessicalyra.pedido_tracker.dto.PedidoResponse;
import com.jessicalyra.pedido_tracker.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    @PostMapping
    public ResponseEntity<PedidoResponse> criar(@Valid @RequestBody  PedidoRequest request) {
        PedidoResponse novoPedido = pedidoService.criar(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(novoPedido);
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponse>> listarTodos() {
        return ResponseEntity.ok(pedidoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pedidoService.buscarPorId(id));
    }

   @PutMapping("/{id}")
    public ResponseEntity<PedidoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody PedidoRequest request
    ) {
        PedidoResponse pedidoAtualizado = pedidoService.atualizar(id, request);

        return ResponseEntity.ok(pedidoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        pedidoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}