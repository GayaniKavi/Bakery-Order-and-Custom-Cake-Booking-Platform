package com.bakery.controller;

import com.bakery.model.CustomCake;
import com.bakery.service.CustomCakeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/custom-cakes")
public class CustomCakeController {

    @Autowired
    private CustomCakeService customCakeService;

    @PostMapping
    public ResponseEntity<?> bookCustomCake(@RequestBody Map<String, Object> request) {
        try {
            Long customerId = Long.valueOf(request.get("customerId").toString());
            String type = request.getOrDefault("type", "CUSTOM").toString().toUpperCase();
            String description = request.get("description").toString();
            String size = request.get("size").toString();
            String flavor = request.get("flavor").toString();
            LocalDate deliveryDate = LocalDate.parse(request.get("deliveryDate").toString());

            CustomCake booking;
            if ("THEME".equals(type)) {
                String theme = request.getOrDefault("theme", "").toString();
                String characterName = request.getOrDefault("characterName", "").toString();
                booking = customCakeService.bookThemeCake(customerId, description, size, flavor, deliveryDate, theme, characterName);
            } else if ("PHOTO".equals(type)) {
                String photoDescription = request.getOrDefault("photoDescription", "").toString();
                String printType = request.getOrDefault("printType", "STANDARD").toString();
                booking = customCakeService.bookPhotoCake(customerId, description, size, flavor, deliveryDate, photoDescription, printType);
            } else {
                CustomCake customCake = new CustomCake(null, description, size, flavor, deliveryDate);
                booking = customCakeService.bookCustomCake(customerId, customCake);
            }
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<CustomCake>> getAllBookings() {
        return ResponseEntity.ok(customCakeService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        return customCakeService.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<CustomCake>> getBookingsByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(customCakeService.getBookingsByCustomer(customerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Long id, @RequestBody CustomCake booking) {
        try {
            CustomCake updated = customCakeService.updateBooking(id, booking);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            CustomCake updated = customCakeService.updateBookingStatus(id, body.get("status"));
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            customCakeService.cancelBooking(id);
            return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
