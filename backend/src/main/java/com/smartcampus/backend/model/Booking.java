package com.smartcampus.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String facilityId;
    private String userId;
    
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    
    private String status; // PENDING, APPROVED, REJECTED
}
