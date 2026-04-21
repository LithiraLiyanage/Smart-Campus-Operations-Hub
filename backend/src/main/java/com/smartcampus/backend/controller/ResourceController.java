package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.ResourceRequestDTO;
import com.smartcampus.backend.dto.ResourceResponseDTO;
import com.smartcampus.backend.model.ResourceStatus;
import com.smartcampus.backend.model.ResourceType;
import com.smartcampus.backend.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
// Uncomment these annotations if standard Spring Security is enabled
// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService service;

    /**
     * GET /api/resources
     * Role rule: USER / ADMIN (Can view and search module data)
     * Filtering parameters maps to MongoDB queries.
     */
    // @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping
    public List<ResourceResponseDTO> getAllResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ResourceStatus status) {
            
        if (type != null || capacity != null || location != null || status != null) {
            return service.filterResources(type, capacity, location, status);
        }
        return service.getAllResources();
    }

    /**
     * GET /api/resources/{id}
     * Role rule: USER / ADMIN (View individual resource metadata)
     */
    // @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/{id}")
    public ResourceResponseDTO getResourceById(@PathVariable @NonNull String id) {
        return service.getResourceById(id);
    }

    /**
     * POST /api/resources
     * Role rule: ADMIN (Admin only can create resources)
     * Applies validation using @Valid on Name, location, and capacity
     */
    // @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResourceResponseDTO createResource(@Valid @RequestBody ResourceRequestDTO request) {
        return service.createResource(request);
    }

    /**
     * PUT /api/resources/{id}
     * Role rule: ADMIN (Admin only updates existing resources)
     */
    // @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResourceResponseDTO updateResource(@PathVariable @NonNull String id, @Valid @RequestBody ResourceRequestDTO request) {
        return service.updateResource(id, request);
    }

    /**
     * DELETE /api/resources/{id}
     * Role rule: ADMIN (Admin only handles deletion logic)
     */
    // @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public void deleteResource(@PathVariable @NonNull String id) {
        service.deleteResource(id);
    }
}
