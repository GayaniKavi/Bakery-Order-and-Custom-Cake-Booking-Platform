package com.bakery.service;

import com.bakery.model.CustomCake;
import com.bakery.model.Customer;
import com.bakery.model.PhotoCake;
import com.bakery.model.ThemeCake;
import com.bakery.repository.CustomCakeRepository;
import com.bakery.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CustomCakeService {

    @Autowired
    private CustomCakeRepository customCakeRepository;

    @Autowired
    private CustomerRepository customerRepository;

    public CustomCake bookCustomCake(Long customerId, CustomCake booking) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        booking.setCustomer(customer);
        return customCakeRepository.save(booking);
    }

    public ThemeCake bookThemeCake(Long customerId, String description, String size,
                                   String flavor, LocalDate deliveryDate,
                                   String theme, String characterName) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        ThemeCake themeCake = new ThemeCake(customer, description, size, flavor, deliveryDate, theme, characterName);
        return (ThemeCake) customCakeRepository.save(themeCake);
    }

    public PhotoCake bookPhotoCake(Long customerId, String description, String size,
                                   String flavor, LocalDate deliveryDate,
                                   String photoDescription, String printType) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        PhotoCake photoCake = new PhotoCake(customer, description, size, flavor, deliveryDate, photoDescription, printType);
        return (PhotoCake) customCakeRepository.save(photoCake);
    }

    public List<CustomCake> getAllBookings() {
        return customCakeRepository.findAll();
    }

    public List<CustomCake> getBookingsByCustomer(Long customerId) {
        return customCakeRepository.findByCustomerId(customerId);
    }

    public Optional<CustomCake> getBookingById(Long id) {
        return customCakeRepository.findById(id);
    }

    public CustomCake updateBooking(Long id, CustomCake updatedBooking) {
        return customCakeRepository.findById(id).map(booking -> {
            booking.setDescription(updatedBooking.getDescription());
            booking.setSize(updatedBooking.getSize());
            booking.setFlavor(updatedBooking.getFlavor());
            booking.setDeliveryDate(updatedBooking.getDeliveryDate());
            booking.setEstimatedPrice(updatedBooking.getEstimatedPrice());
            return customCakeRepository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public CustomCake updateBookingStatus(Long id, String status) {
        return customCakeRepository.findById(id).map(booking -> {
            booking.setStatus(CustomCake.BookingStatus.valueOf(status.toUpperCase()));
            return customCakeRepository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public void cancelBooking(Long id) {
        customCakeRepository.findById(id).map(booking -> {
            booking.setStatus(CustomCake.BookingStatus.CANCELLED);
            return customCakeRepository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }
}
