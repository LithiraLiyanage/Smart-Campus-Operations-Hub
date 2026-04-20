package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.FacilityRequest;
import com.smartcampus.backend.model.Facility;
import com.smartcampus.backend.repository.FacilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.lang.NonNull;
import java.util.List;

@Service
public class FacilityService {

    @Autowired
    private FacilityRepository repository;

    public Facility create(FacilityRequest request) {
        Facility f = new Facility();
        f.setName(request.getName());
        f.setType(request.getType());
        f.setCapacity(request.getCapacity());
        f.setLocation(request.getLocation());
        f.setStatus(request.getStatus());

        return repository.save(f);
    }

    public List<Facility> getAll() {
        return repository.findAll();
    }

    public Facility getById(@NonNull String id) {
        return repository.findById(id).orElse(null);
    }

    public Facility update(@NonNull String id, FacilityRequest request) {
        Facility f = repository.findById(id).orElse(null);

        if (f != null) {
            f.setName(request.getName());
            f.setType(request.getType());
            f.setCapacity(request.getCapacity());
            f.setLocation(request.getLocation());
            f.setStatus(request.getStatus());
            return repository.save(f);
        }

        return null;
    }

    public void delete(@NonNull String id) {
        repository.deleteById(id);
    }
}
