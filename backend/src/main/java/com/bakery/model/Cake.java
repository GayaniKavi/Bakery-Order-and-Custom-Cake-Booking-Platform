package com.bakery.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@Entity
@Table(name = "cakes")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "cake_type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("REGULAR")
public class Cake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    private String description;

    @Positive
    private Double price;

    private String size;
    private String flavor;

    @Column(name = "cake_type", insertable = false, updatable = false)
    private String cakeType;

    // Constructors
    public Cake() {}

    public Cake(String name, String description, Double price, String size, String flavor) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.size = size;
        this.flavor = flavor;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getFlavor() { return flavor; }
    public void setFlavor(String flavor) { this.flavor = flavor; }

    public String getCakeType() { return cakeType; }

    @Override
    public String toString() {
        return "Cake{id=" + id + ", name='" + name + "', price=" + price + "}";
    }
}
