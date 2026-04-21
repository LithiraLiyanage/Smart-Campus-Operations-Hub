package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.ResourceRequestDTO;
import com.smartcampus.backend.dto.ResourceResponseDTO;
import com.smartcampus.backend.exception.ResourceNotFoundException;
import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.model.ResourceStatus;
import com.smartcampus.backend.model.ResourceType;
import com.smartcampus.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceServiceImpl implements ResourceService {

    @Autowired
    private ResourceRepository repository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<ResourceResponseDTO> getAllResources() {
        return repository.findAll().stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public ResourceResponseDTO getResourceById(@NonNull String id) {
        Resource resource = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id " + id));
        return mapToResponseDTO(resource);
    }

    @Override
    public ResourceResponseDTO createResource(ResourceRequestDTO request) {
        Resource resource = new Resource();
        mapToEntity(request, resource);
        return mapToResponseDTO(repository.save(resource));
    }

    @Override
    public ResourceResponseDTO updateResource(@NonNull String id, ResourceRequestDTO request) {
        Resource resource = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id " + id));
        mapToEntity(request, resource);
        return mapToResponseDTO(repository.save(resource));
    }

    @Override
    public void deleteResource(@NonNull String id) {
        Resource resource = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id " + id));
        repository.delete(resource);
    }

    @Override
    public List<ResourceResponseDTO> filterResources(ResourceType type, Integer capacity, String location, ResourceStatus status) {
        // Dynamic filtering logic using MongoTemplate to allow combination filtering seamlessly
        Query query = new Query();

        if (type != null) {
            query.addCriteria(Criteria.where("type").is(type));
        }
        if (capacity != null && capacity > 0) {
            query.addCriteria(Criteria.where("capacity").gte(capacity));
        }
        if (location != null && !location.isEmpty()) {
            query.addCriteria(Criteria.where("location").is(location));
        }
        if (status != null) {
            query.addCriteria(Criteria.where("status").is(status));
        }

        List<Resource> filteredResources = mongoTemplate.find(query, Resource.class);
        return filteredResources.stream().map(this::mapToResponseDTO).collect(Collectors.toList());
    }

    private void mapToEntity(ResourceRequestDTO request, Resource resource) {
        resource.setName(request.getName());
        resource.setType(request.getType());
        resource.setCapacity(request.getCapacity());
        resource.setLocation(request.getLocation());
        resource.setDescription(request.getDescription());
        resource.setAvailableFrom(request.getAvailableFrom());
        resource.setAvailableTo(request.getAvailableTo());
        resource.setStatus(request.getStatus());
    }

    private ResourceResponseDTO mapToResponseDTO(Resource resource) {
        ResourceResponseDTO response = new ResourceResponseDTO();
        response.setId(resource.getId());
        response.setName(resource.getName());
        response.setType(resource.getType());
        response.setCapacity(resource.getCapacity());
        response.setLocation(resource.getLocation());
        response.setDescription(resource.getDescription());
        response.setAvailableFrom(resource.getAvailableFrom());
        response.setAvailableTo(resource.getAvailableTo());
        response.setStatus(resource.getStatus());
        return response;
    }
}
