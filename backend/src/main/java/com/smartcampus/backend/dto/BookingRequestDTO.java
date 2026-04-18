package com.smartcampus.backend.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingRequestDTO {

    @NotBlank(message = "Resource ID is required")
    private String resourceId;

    @NotBlank(message = "Resource name is required")
    private String resourceName;

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "User name is required")
    private String userName;

    @NotBlank(message = "Purpose is required")
    private String purpose;

    @Min(value = 1, message = "At least 1 attendee required")
    private int expectedAttendees;

    private String specialRequirements;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;
}