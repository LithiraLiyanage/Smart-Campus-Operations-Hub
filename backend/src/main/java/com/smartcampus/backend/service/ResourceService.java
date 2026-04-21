package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.ResourceRequestDTO;
import com.smartcampus.backend.dto.ResourceResponseDTO;
import com.smartcampus.backend.model.ResourceStatus;
import com.smartcampus.backend.model.ResourceType;

import java.util.List;

public interface ResourceService {
    List<ResourceResponseDTO> getAllResources();
    ResourceResponseDTO getResourceById(String id);
    ResourceResponseDTO createResource(ResourceRequestDTO request);
    ResourceResponseDTO updateResource(String id, ResourceRequestDTO request);
    void deleteResource(String id);

    // Dynamic filtering for resources matching given conditions
    List<ResourceResponseDTO> filterResources(ResourceType type, Integer capacity, String location, ResourceStatus status);
}
