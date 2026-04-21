package com.smartcampus.backend.dto;

import com.smartcampus.backend.model.ResourceStatus;
import com.smartcampus.backend.model.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ResourceRequestDTO {
    
    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Type is required")
    private ResourceType type;

    @Min(value = 1, message = "Capacity must be greater than 0")
    private int capacity;

    @NotBlank(message = "Location is required")
    private String location;

    private String description;
    
    private String availableFrom;
    
    private String availableTo;

    @NotNull(message = "Status is required")
    private ResourceStatus status;
}
