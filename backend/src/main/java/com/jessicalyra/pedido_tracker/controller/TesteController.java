package com.jessicalyra.pedido_tracker.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
public class TesteController {

    @GetMapping("/api/teste")
    public String teste() {
        return "Você está autenticado!";
    }


    @PostMapping("/api/teste")
    public String testePost() {
        return "POST autenticado funcionando!";
    }
}