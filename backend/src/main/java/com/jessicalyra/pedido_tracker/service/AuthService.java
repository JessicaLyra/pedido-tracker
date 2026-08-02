package com.jessicalyra.pedido_tracker.service;

import com.jessicalyra.pedido_tracker.dto.RegisterRequest;
import com.jessicalyra.pedido_tracker.model.User;
import com.jessicalyra.pedido_tracker.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.jessicalyra.pedido_tracker.exception.EmailAlreadyExistsException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("E-mail já cadastrado");
        }

        User user = new User();

        user.setNome(request.getNome());
        user.setEmail(request.getEmail());
        user.setSenha(passwordEncoder.encode(request.getSenha()));

        return userRepository.save(user);
    }
}