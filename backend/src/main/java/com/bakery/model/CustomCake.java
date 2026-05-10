package com.bakery.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "custom_cakes")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "custom_type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("CUSTOM")
public class CustomCake {

    public enum BookingStatus { PENDING, APPROVED, IN_PROGRESS, READY, CANCELLED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    private String description;
    private String size;
    private String flavor;
    private Double estimatedPrice;
    private LocalDate deliveryDate;
    private LocalDate bookingDate;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @Column(name = "custom_type", insertable = false, updatable = false)
    private String customType;

    // Constructors
    public CustomCake() {
        this.bookingDate = LocalDate.now();
        this.status = BookingStatus.PENDING;
    }

    public CustomCake(Customer customer, String description, String size, String flavor, LocalDate deliveryDate) {
        this();
        this.customer = customer;
        this.description = description;
        this.size = size;
        this.flavor = flavor;
        this.deliveryDate = deliveryDate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getFlavor() { return flavor; }
    public void setFlavor(String flavor) { this.flavor = flavor; }

    public Double getEstimatedPrice() { return estimatedPrice; }
    public void setEstimatedPrice(Double estimatedPrice) { this.estimatedPrice = estimatedPrice; }

    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getCustomType() { return customType; }

    @Override
    public String toString() {
        return "CustomCake{id=" + id + ", status=" + status + ", deliveryDate=" + deliveryDate + "}";
    }
}
