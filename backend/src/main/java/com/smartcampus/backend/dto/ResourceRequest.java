package com.smartcampus.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ResourceRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Type is required")
    private String type;

    @Min(value = 1, message = "Capacity must be at least 1")
    private int capacity;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Status is required")
    private String status;
}