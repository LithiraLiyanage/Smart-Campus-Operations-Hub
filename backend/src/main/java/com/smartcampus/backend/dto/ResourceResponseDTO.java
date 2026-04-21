package com.smartcampus.backend.dto;

import com.smartcampus.backend.model.ResourceStatus;
import com.smartcampus.backend.model.ResourceType;
import lombok.Data;

@Data
public class ResourceResponseDTO {
    private String id;
    private String name;
    private ResourceType type;
    private int capacity;
    private String location;
    private String description;
    private String availableFrom;
    private String availableTo;
    private ResourceStatus status;
}
