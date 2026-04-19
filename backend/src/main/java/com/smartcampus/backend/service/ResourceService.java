package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.ResourceRequest;
import com.smartcampus.backend.exception.ResourceNotFoundException;
import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.lang.NonNull;

@Service
@SuppressWarnings("null")
public class ResourceService {

    @Autowired
    private ResourceRepository repository;

    public List<Resource> getAllResources() {
        return repository.findAll();
    }

    public Resource getResourceById(@NonNull String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id " + id));
    }

    public Resource createResource(ResourceRequest request) {
        Resource resource = new Resource();
        mapToEntity(request, resource);
        return repository.save(resource);
    }

    public Resource updateResource(@NonNull String id, ResourceRequest request) {
        Resource resource = getResourceById(id);
        mapToEntity(request, resource);
        return repository.save(resource);
    }

    public void deleteResource(@NonNull String id) {
        Resource resource = getResourceById(id);
        repository.delete(resource);
    }

    private void mapToEntity(ResourceRequest request, Resource resource) {
        resource.setName(request.getName());
        resource.setType(request.getType());
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setDescription(request.getDescription());
        resource.setAvailableFrom(request.getAvailableFrom());
        resource.setAvailableTo(request.getAvailableTo());
        resource.setStatus(request.getStatus());
    }
}
