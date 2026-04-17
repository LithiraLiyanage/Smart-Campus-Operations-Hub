package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.ResourceRequest;
import com.smartcampus.backend.model.Resource;
import com.smartcampus.backend.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.lang.NonNull;
import java.util.List;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository repository;

    public Resource create(ResourceRequest request) {
        Resource r = new Resource();
        r.setName(request.getName());
        r.setType(request.getType());
        r.setCapacity(request.getCapacity());
        r.setLocation(request.getLocation());
        r.setStatus(request.getStatus());

        return repository.save(r);
    }

    public List<Resource> getAll() {
        return repository.findAll();
    }

    public Resource getById(@NonNull String id) {
        return repository.findById(id).orElse(null);
    }

    public Resource update(@NonNull String id, ResourceRequest request) {
        Resource r = repository.findById(id).orElse(null);

        if (r != null) {
            r.setName(request.getName());
            r.setType(request.getType());
            r.setCapacity(request.getCapacity());
            r.setLocation(request.getLocation());
            r.setStatus(request.getStatus());
            return repository.save(r);
        }

        return null;
    }

    public void delete(@NonNull String id) {
        repository.deleteById(id);
    }
}