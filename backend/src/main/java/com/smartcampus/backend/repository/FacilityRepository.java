package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Facility;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FacilityRepository extends MongoRepository<Facility, String> {
}
