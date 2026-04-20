package com.smartcampus.backend.config;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            userRepository.save(admin);
            System.out.println("Seeded default admin account (admin / admin123)");
        }

        if (userRepository.findByUsername("user").isEmpty()) {
            User user = new User();
            user.setUsername("user");
            user.setPassword("user123");
            user.setRole("USER");
            userRepository.save(user);
            System.out.println("Seeded default user account (user / user123)");
        }
    }
}
