package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.model.ResourceStatus;
import com.smartcampus.backend.model.ResourceType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    
    // Custom queries required by the Facilities & Assets module
    List<Resource> findByType(ResourceType type);
    List<Resource> findByCapacityGreaterThanEqual(int capacity);
    List<Resource> findByLocation(String location);
    List<Resource> findByStatus(ResourceStatus status);

    // Common combinations (useful for simple cases; complex combinations handled in service via MongoTemplate)
    List<Resource> findByTypeAndStatus(ResourceType type, ResourceStatus status);
    List<Resource> findByTypeAndCapacityGreaterThanEqual(ResourceType type, int capacity);
    List<Resource> findByStatusAndCapacityGreaterThanEqual(ResourceStatus status, int capacity);
}
