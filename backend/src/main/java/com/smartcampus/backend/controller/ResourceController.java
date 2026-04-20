package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.ResourceRequest;
import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService service;

    @GetMapping
    public List<Resource> getAllResources() {
        return service.getAllResources();
    }

    @GetMapping("/{id}")
    public Resource getResourceById(@PathVariable @NonNull String id) {
        return service.getResourceById(id);
    }

    @PostMapping
    public Resource createResource(@Valid @RequestBody ResourceRequest request) {
        return service.createResource(request);
    }

    @PutMapping("/{id}")
    public Resource updateResource(@PathVariable @NonNull String id, @Valid @RequestBody ResourceRequest request) {
        return service.updateResource(id, request);
    }

    @DeleteMapping("/{id}")
    public void deleteResource(@PathVariable @NonNull String id) {
        service.deleteResource(id);
    }
}
