package com.bakery.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@DiscriminatorValue("THEME")
public class ThemeCake extends CustomCake {

    private String theme;
    private String characterName;

    // Constructors
    public ThemeCake() {}

    public ThemeCake(Customer customer, String description, String size, String flavor,
                     LocalDate deliveryDate, String theme, String characterName) {
        super(customer, description, size, flavor, deliveryDate);
        this.theme = theme;
        this.characterName = characterName;
    }

    // Getters and Setters
    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public String getCharacterName() { return characterName; }
    public void setCharacterName(String characterName) { this.characterName = characterName; }

    @Override
    public String toString() {
        return "ThemeCake{theme='" + theme + "', character='" + characterName + "'}";
    }
}
