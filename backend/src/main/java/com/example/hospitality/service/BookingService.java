package com.example.hospitality.service;

import com.example.hospitality.model.Booking;

import java.util.List;

public interface BookingService {
    Booking saveBooking(Booking booking);
    List<Booking> getAllBookings();
    List<Booking> getBookingsByUserId(String userId);
    Booking getBookingById(Long id);
    void deleteBooking(Long id);
}
