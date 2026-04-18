package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    
    List<Booking> findByFacilityIdAndDate(String facilityId, LocalDate date);

    @Query("{ 'facilityId': ?0, 'date': ?1, 'status': { $ne: 'REJECTED' }, " +
           "$or: [ " +
           "{ $and: [ { 'startTime': { $lt: ?3 } }, { 'endTime': { $gt: ?2 } } ] } " +
           "] }")
    List<Booking> findOverlappingBookings(String facilityId, LocalDate date, LocalTime startTime, LocalTime endTime);
}
