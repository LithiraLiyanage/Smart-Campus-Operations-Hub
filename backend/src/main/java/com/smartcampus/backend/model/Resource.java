package com.smartcampus.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Data
@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

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
