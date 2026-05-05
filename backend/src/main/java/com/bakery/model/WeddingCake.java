package com.bakery.model;

import jakarta.persistence.*;

@Entity
@DiscriminatorValue("WEDDING")
public class WeddingCake extends Cake {

    private Integer tiers;
    private String decorationStyle;

    // Constructors
    public WeddingCake() {}

    public WeddingCake(String name, String description, Double price,
                       String size, String flavor, Integer tiers, String decorationStyle) {
        super(name, description, price, size, flavor);
        this.tiers = tiers;
        this.decorationStyle = decorationStyle;
    }

    // Getters and Setters
    public Integer getTiers() { return tiers; }
    public void setTiers(Integer tiers) { this.tiers = tiers; }

    public String getDecorationStyle() { return decorationStyle; }
    public void setDecorationStyle(String decorationStyle) { this.decorationStyle = decorationStyle; }

    @Override
    public String toString() {
        return "WeddingCake{name='" + getName() + "', tiers=" + tiers + ", decorationStyle='" + decorationStyle + "'}";
    }
}
