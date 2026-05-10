package com.bakery.controller;

import com.bakery.model.BirthdayCake;
import com.bakery.model.Cake;
import com.bakery.model.WeddingCake;
import com.bakery.service.CakeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cakes")
public class CakeController {

    @Autowired
    private CakeService cakeService;

    @PostMapping
    public ResponseEntity<Cake> addCake(@RequestBody Cake cake) {
        return ResponseEntity.ok(cakeService.addCake(cake));
    }

    @PostMapping("/birthday")
    public ResponseEntity<Cake> addBirthdayCake(@RequestBody BirthdayCake cake) {
        return ResponseEntity.ok(cakeService.addCake(cake));
    }

    @PostMapping("/wedding")
    public ResponseEntity<Cake> addWeddingCake(@RequestBody WeddingCake cake) {
        return ResponseEntity.ok(cakeService.addCake(cake));
    }

    @GetMapping
    public ResponseEntity<List<Cake>> getAllCakes() {
        return ResponseEntity.ok(cakeService.getAllCakes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCakeById(@PathVariable Long id) {
        return cakeService.getCakeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Cake>> searchCakes(@RequestParam String name) {
        return ResponseEntity.ok(cakeService.searchCakes(name));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Cake>> getCakesByType(@PathVariable String type) {
        return ResponseEntity.ok(cakeService.getCakesByType(type.toUpperCase()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCake(@PathVariable Long id, @RequestBody Cake cake) {
        try {
            Cake updated = cakeService.updateCake(id, cake);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCake(@PathVariable Long id) {
        cakeService.deleteCake(id);
        return ResponseEntity.ok(Map.of("message", "Cake deleted successfully"));
    }
}
