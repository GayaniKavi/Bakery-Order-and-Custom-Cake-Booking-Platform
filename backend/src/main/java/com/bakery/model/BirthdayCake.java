package com.bakery.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("BIRTHDAY")
public class BirthdayCake extends Cake {

    private String ageGroup;
    private String theme;

    // Constructors
    public BirthdayCake() {}

    public BirthdayCake(String name, String description, Double price,
                        String size, String flavor, String ageGroup, String theme) {
        super(name, description, price, size, flavor);
        this.ageGroup = ageGroup;
        this.theme = theme;
    }

    // Getters and Setters
    public String getAgeGroup() { return ageGroup; }
    public void setAgeGroup(String ageGroup) { this.ageGroup = ageGroup; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    @Override
    public String toString() {
        return "BirthdayCake{name='" + getName() + "', ageGroup='" + ageGroup + "', theme='" + theme + "'}";
    }
}
