package com.bakery.config;

import com.bakery.model.BirthdayCake;
import com.bakery.model.Customer;
import com.bakery.model.WeddingCake;
import com.bakery.repository.CakeRepository;
import com.bakery.repository.CustomerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(CustomerRepository customerRepo, CakeRepository cakeRepo) {
        return args -> {
            // Admin account
            if (!customerRepo.existsByEmail("admin@bakery.com")) {
                customerRepo.save(new Customer("Admin", "admin@bakery.com", "admin123", "011-0000000", "Bakery HQ"));
            }

            // Sample cakes
            if (cakeRepo.count() == 0) {
                cakeRepo.save(new BirthdayCake("Superhero Blast", "Fun superhero themed birthday cake", 85.00, "Medium", "Chocolate", "Kids (1-12)", "Superhero"));
                cakeRepo.save(new BirthdayCake("Princess Dream", "Elegant princess themed cake", 90.00, "Large", "Strawberry", "Kids (1-12)", "Princess"));
                cakeRepo.save(new WeddingCake("Classic Elegance", "3-tier classic white wedding cake", 350.00, "Extra Large", "Vanilla", 3, "Floral"));
                cakeRepo.save(new WeddingCake("Royal Splendor", "5-tier royal wedding masterpiece", 600.00, "Extra Large", "Red Velvet", 5, "Minimalist"));

                com.bakery.model.Cake choco = new com.bakery.model.Cake("Chocolate Fudge", "Rich dark chocolate cake", 65.00, "Medium", "Chocolate");
                com.bakery.model.Cake lemon = new com.bakery.model.Cake("Lemon Zest", "Light and refreshing lemon cake", 55.00, "Small", "Lemon");
                cakeRepo.save(choco);
                cakeRepo.save(lemon);
            }
        };
    }
}
