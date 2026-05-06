package com.bakery.service;

import com.bakery.model.Cake;
import com.bakery.repository.CakeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CakeService {

    @Autowired
    private CakeRepository cakeRepository;

    public Cake addCake(Cake cake) {
        return cakeRepository.save(cake);
    }

    public List<Cake> getAllCakes() {
        return cakeRepository.findAll();
    }

    public Optional<Cake> getCakeById(Long id) {
        return cakeRepository.findById(id);
    }

    public List<Cake> searchCakes(String name) {
        return cakeRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Cake> getCakesByType(String type) {
        return cakeRepository.findByCakeType(type);
    }

    public Cake updateCake(Long id, Cake updatedCake) {
        return cakeRepository.findById(id).map(cake -> {
            cake.setName(updatedCake.getName());
            cake.setDescription(updatedCake.getDescription());
            cake.setPrice(updatedCake.getPrice());
            cake.setSize(updatedCake.getSize());
            cake.setFlavor(updatedCake.getFlavor());
            return cakeRepository.save(cake);
        }).orElseThrow(() -> new RuntimeException("Cake not found with id: " + id));
    }

    public void deleteCake(Long id) {
        cakeRepository.deleteById(id);
    }
}
