package com.smartcampus.backend.dto;

import com.smartcampus.backend.enums.BookingStatus;
import lombok.Data;

@Data
public class BookingStatusUpdateDTO {
    private BookingStatus status;  // APPROVED or REJECTED
    private String reason;         // required if REJECTED
}
