package backend.controller;

import backend.model.LoginRequest;
import backend.model.User;
import backend.repository.UserRepository;
import backend.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/users")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/users")
    public List<User> getUsers(@RequestParam(required = false) String role) {
        if (role == null || role.isBlank()) {
            return userRepository.findAll();
        }
        return userRepository.findAll().stream()
                .filter(user -> role.equalsIgnoreCase(user.getRole()))
                .collect(Collectors.toList());
    }
}
