package com.bakery.repository;

import com.bakery.model.CustomCake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomCakeRepository extends JpaRepository<CustomCake, Long> {
    List<CustomCake> findByCustomerId(Long customerId);
    List<CustomCake> findByStatus(CustomCake.BookingStatus status);
}
