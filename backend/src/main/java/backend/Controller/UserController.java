package backend.Controller;

import backend.Exception.UserNotFoundException;
import backend.Model.UserModel;
import backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    public UserRepository userRepository;

    // Create new user
    @PostMapping("/users")
    public UserModel newUserModel(@RequestBody UserModel newUserModel) {
        return userRepository.save(newUserModel);
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserModel loginDetails) {
        UserModel user = userRepository.findAllByEmail(loginDetails.getEmail())
                .orElseThrow(() -> new UserNotFoundException(loginDetails.getEmail()));

        if (user.getPassword().equals(loginDetails.getPassword())) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("id", user.getId());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Wrong Password"));
        }
    }

    // Get all users
    @GetMapping("/users")
    public List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }

    // Get user by id
    @GetMapping("/users/{id}")
    public UserModel getUserById(@PathVariable String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + id));
    }

    // Update User
    @PutMapping("/users/{id}")
    public UserModel updateUser(
            @PathVariable String id,
            @RequestBody UserModel newUserModel
    ) {
        return userRepository.findById(id).map(userModel -> {
            userModel.setName(newUserModel.getName());
            userModel.setEmail(newUserModel.getEmail());

            if (newUserModel.getPassword() != null && !newUserModel.getPassword().isEmpty()) {
                userModel.setPassword(newUserModel.getPassword());
            }

            return userRepository.save(userModel);
        }).orElseThrow(() -> new UserNotFoundException("User not found: " + id));
    }

    // Delete User
    @DeleteMapping("/users/{id}")
    public String deleteProfile(@PathVariable String id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User not found: " + id);
        }
        userRepository.deleteById(id);
        return "User " + id + " has been deleted";
    }
}
