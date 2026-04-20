package com.smartcampus.backend.service;

import com.smartcampus.backend.dto.BookingRequest;
import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository repository;

    public Booking createBooking(BookingRequest request) {
        if (request.getStartTime().isAfter(request.getEndTime()) || request.getStartTime().equals(request.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        List<Booking> overlaps = repository.findOverlappingBookings(
                request.getFacilityId(),
                request.getDate(),
                request.getStartTime(),
                request.getEndTime()
        );

        if (!overlaps.isEmpty()) {
            throw new IllegalStateException("Facility is already booked for the selected time slot");
        }

        Booking booking = new Booking();
        booking.setFacilityId(request.getFacilityId());
        booking.setUserId(request.getUserId());
        booking.setDate(request.getDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setStatus("APPROVED"); // Auto-approve for now based on plan

        return repository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return repository.findAll();
    }
    
    public List<Booking> getBookingsForFacilityAndDate(String facilityId, LocalDate date) {
        return repository.findByFacilityIdAndDate(facilityId, date);
    }
}
