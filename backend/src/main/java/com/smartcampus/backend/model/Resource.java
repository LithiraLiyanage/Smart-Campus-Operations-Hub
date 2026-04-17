package com.smartcampus.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

    private String name;
    private String type;
    private int capacity;
    private String location;
    private String status;
}