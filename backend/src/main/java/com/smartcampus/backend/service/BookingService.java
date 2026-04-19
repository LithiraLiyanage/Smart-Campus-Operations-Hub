package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.*;
import com.smartcampus.backend.enums.BookingStatus;
import com.smartcampus.backend.exception.ConflictException;
import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;

    // Create a new booking (starts as PENDING)
    public Booking createBooking(BookingRequestDTO dto) {
    if (!dto.getEndTime().isAfter(dto.getStartTime())) {
        throw new IllegalStateException("End time must be after start time");
    }

    // Check for conflicts with PENDING and APPROVED bookings
    List<Booking> conflicts = bookingRepository.findConflictingBookings(
            dto.getResourceId().toUpperCase(),
            dto.getStartTime(),
            dto.getEndTime()
    );

    if (!conflicts.isEmpty()) {
        throw new ConflictException(
            "This resource is already booked between " +
            dto.getStartTime().toLocalTime() + " and " +
            dto.getEndTime().toLocalTime() +
            " on " + dto.getStartTime().toLocalDate() +
            ". Please choose a different time slot."
        );
    }

    Booking booking = Booking.builder()
            .resourceId(dto.getResourceId().toUpperCase())
            .resourceName(dto.getResourceName())
            .userId(dto.getUserId())
            .userName(dto.getUserName())
            .purpose(dto.getPurpose())
            .expectedAttendees(dto.getExpectedAttendees())
            .specialRequirements(dto.getSpecialRequirements())
            .contactNumber(dto.getContactNumber())
            .startTime(dto.getStartTime())
            .endTime(dto.getEndTime())
            .status(BookingStatus.PENDING)
            .createdAt(LocalDateTime.now())
            .updatedAt(LocalDateTime.now())
            .build();

    return bookingRepository.save(booking);
}

    // Get all bookings (admin)
    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    // Get bookings for a specific user
    public List<Booking> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    // Get a single booking by ID
    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Booking not found: " + id));
    }

    // Admin approves or rejects a booking
    public Booking updateBookingStatus(String id, BookingStatusUpdateDTO dto) {
        Booking booking = getBookingById(id);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalStateException("Only PENDING bookings can be approved or rejected");
        }

        if (dto.getStatus() == BookingStatus.APPROVED) {
            // Check for scheduling conflicts before approving
            List<Booking> conflicts = bookingRepository.findConflictingBookings(
                    booking.getResourceId(),
                    booking.getStartTime(),
                    booking.getEndTime()
            );
            if (!conflicts.isEmpty()) {
                throw new ConflictException("Resource is already booked for this time slot");
            }
        }

        if (dto.getStatus() == BookingStatus.REJECTED && 
            (dto.getReason() == null || dto.getReason().isBlank())) {
            throw new IllegalStateException("A reason is required when rejecting a booking");
        }

        booking.setStatus(dto.getStatus());
        booking.setAdminReason(dto.getReason());
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }

    public Booking updateBooking(String id, BookingRequestDTO dto) {
    Booking booking = getBookingById(id);

    if (booking.getStatus() != BookingStatus.PENDING) {
        throw new IllegalStateException("Only PENDING bookings can be updated");
    }

    if (!dto.getEndTime().isAfter(dto.getStartTime())) {
        throw new IllegalStateException("End time must be after start time");
    }

    // Check conflicts excluding current booking
    List<Booking> conflicts = bookingRepository.findConflictingBookings(
            dto.getResourceId().toUpperCase(),
            dto.getStartTime(),
            dto.getEndTime()
    ).stream()
     .filter(b -> !b.getId().equals(id)) // exclude self
     .toList();

    if (!conflicts.isEmpty()) {
        throw new ConflictException(
            "This resource is already booked between " +
            dto.getStartTime().toLocalTime() + " and " +
            dto.getEndTime().toLocalTime() +
            " on " + dto.getStartTime().toLocalDate() +
            ". Please choose a different time slot."
        );
    }

    booking.setResourceId(dto.getResourceId().toUpperCase());
    booking.setResourceName(dto.getResourceName());
    booking.setUserId(dto.getUserId());
    booking.setUserName(dto.getUserName());
    booking.setPurpose(dto.getPurpose());
    booking.setExpectedAttendees(dto.getExpectedAttendees());
    booking.setSpecialRequirements(dto.getSpecialRequirements());
    booking.setContactNumber(dto.getContactNumber());
    booking.setStartTime(dto.getStartTime());
    booking.setEndTime(dto.getEndTime());
    booking.setUpdatedAt(LocalDateTime.now());

    return bookingRepository.save(booking);
}

    // User cancels their own approved booking
    public Booking cancelBooking(String id, String userId) {
        Booking booking = getBookingById(id);

        if (!booking.getUserId().equals(userId)) {
            throw new IllegalStateException("You can only cancel your own bookings");
        }

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Only APPROVED bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    // Delete a booking (admin only)
    public void deleteBooking(String id) {
        if (!bookingRepository.existsById(id)) {
            throw new NoSuchElementException("Booking not found: " + id);
        }
        bookingRepository.deleteById(id);
    }
}
