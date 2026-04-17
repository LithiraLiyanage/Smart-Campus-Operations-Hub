package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.*;
import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor

public class BookingController {
    private final BookingService bookingService;

    // POST /api/bookings — user creates a booking
    @PostMapping
    public ResponseEntity<Booking> createBooking(@Valid @RequestBody BookingRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(dto));
    }

    // GET /api/bookings — admin gets all bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // GET /api/bookings/{id} — get single booking
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }
    // GET /api/bookings/user/{userId} — get bookings for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    // PATCH /api/bookings/{id}/status — admin approves or rejects
    @PatchMapping("/{id}/status")
    public ResponseEntity<Booking> updateStatus(
            @PathVariable String id,
            @RequestBody BookingStatusUpdateDTO dto) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, dto));
    }

    // PATCH /api/bookings/{id}/cancel — user cancels their booking
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancelBooking(
            @PathVariable String id,
            @RequestParam String userId) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, userId));
    }
    // DELETE /api/bookings/{id} — admin deletes a booking
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
