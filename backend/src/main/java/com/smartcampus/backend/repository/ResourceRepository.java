package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ResourceRepository extends MongoRepository<Resource, String> {
}