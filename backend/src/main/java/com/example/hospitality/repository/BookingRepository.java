package com.example.hospitality.repository;

import com.example.hospitality.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    // You can define custom queries here if needed later
}
