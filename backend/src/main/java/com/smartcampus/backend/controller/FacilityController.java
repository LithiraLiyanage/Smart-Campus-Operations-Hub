package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.FacilityRequest;
import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.model.Facility;
import com.smartcampus.backend.service.BookingService;
import com.smartcampus.backend.service.FacilityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import org.springframework.lang.NonNull;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/facilities")
public class FacilityController {

    @Autowired
    private FacilityService service;

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public Facility create(@Valid @RequestBody FacilityRequest request) {
        return service.create(request);
    }

    @GetMapping
    public List<Facility> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Facility getById(@PathVariable @NonNull String id) {
        return service.getById(id);
    }

    @GetMapping("/{id}/availability")
    public List<Booking> getAvailability(@PathVariable @NonNull String id,
                                         @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return bookingService.getBookingsForFacilityAndDate(id, date);
    }

    @PutMapping("/{id}")
    public Facility update(@PathVariable @NonNull String id,
                           @Valid @RequestBody FacilityRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @NonNull String id) {
        service.delete(id);
    }
}
