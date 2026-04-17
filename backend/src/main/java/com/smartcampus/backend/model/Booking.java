package com.smartcampus.backend.model;

import com.smartcampus.backend.enums.BookingStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Booking {
    @Id
    private String id;

    private String resourceId;       // from Module A
    private String userId;           // authenticated user's ID
    private String purpose;
    private int expectedAttendees;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private BookingStatus status;    // PENDING, APPROVED, REJECTED, CANCELLED

    private String adminReason;      // reason for rejection or cancellation
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
}
