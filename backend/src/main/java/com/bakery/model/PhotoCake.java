package com.bakery.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@DiscriminatorValue("PHOTO")
public class PhotoCake extends CustomCake {

    private String photoDescription;
    private String printType;

    // Constructors
    public PhotoCake() {}

    public PhotoCake(Customer customer, String description, String size, String flavor,
                     LocalDate deliveryDate, String photoDescription, String printType) {
        super(customer, description, size, flavor, deliveryDate);
        this.photoDescription = photoDescription;
        this.printType = printType;
    }

    // Getters and Setters
    public String getPhotoDescription() { return photoDescription; }
    public void setPhotoDescription(String photoDescription) { this.photoDescription = photoDescription; }

    public String getPrintType() { return printType; }
    public void setPrintType(String printType) { this.printType = printType; }

    @Override
    public String toString() {
        return "PhotoCake{photoDescription='" + photoDescription + "', printType='" + printType + "'}";
    }
}
