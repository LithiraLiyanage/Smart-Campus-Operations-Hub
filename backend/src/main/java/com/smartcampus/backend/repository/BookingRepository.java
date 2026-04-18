package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Booking;
import com.smartcampus.backend.enums.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);

    List<Booking> findByResourceId(String resourceId);

    // Find overlapping APPROVED bookings for conflict detection
    @Query("{ 'resourceId': ?0, 'status': { $in: ['PENDING', 'APPROVED'] }, " +
       "'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 } }")
List<Booking> findConflictingBookings(String resourceId,
                                      LocalDateTime startTime,
                                      LocalDateTime endTime);

    List<Booking> findByStatus(BookingStatus status);
    List<Booking> findAllByOrderByCreatedAtDesc();
    
}
