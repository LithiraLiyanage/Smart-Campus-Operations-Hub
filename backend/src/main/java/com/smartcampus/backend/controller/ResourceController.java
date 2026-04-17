package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.ResourceRequest;
import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.lang.NonNull;
import java.util.List;
@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService service;

    @PostMapping
    public Resource create(@Valid @RequestBody ResourceRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<Resource> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Resource getById(@PathVariable @NonNull String id) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public Resource update(@PathVariable @NonNull String id,
                           @Valid @RequestBody ResourceRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @NonNull String id) {
        service.delete(id);
    }
}