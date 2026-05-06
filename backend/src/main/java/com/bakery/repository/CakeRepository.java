package com.bakery.repository;

import com.bakery.model.Cake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CakeRepository extends JpaRepository<Cake, Long> {
    List<Cake> findByNameContainingIgnoreCase(String name);
    List<Cake> findByCakeType(String cakeType);
}
