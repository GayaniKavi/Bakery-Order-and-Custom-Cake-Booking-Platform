package com.bakery.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "orders")
public class Order {

    public enum OrderStatus { PENDING, CONFIRMED, DELIVERED, CANCELLED }
    public enum OrderType { STANDARD, EXPRESS, PICKUP }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "cake_id", nullable = false)
    private Cake cake;

    private Integer quantity;
    private Double totalPrice;
    private LocalDate orderDate;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    @Enumerated(EnumType.STRING)
    private OrderType orderType;

    private String deliveryAddress;

    // Constructors
    public Order() {
        this.orderDate = LocalDate.now();
        this.status = OrderStatus.PENDING;
        this.orderType = OrderType.STANDARD;
    }

    public Order(Customer customer, Cake cake, Integer quantity, String deliveryAddress, OrderType orderType) {
        this();
        this.customer = customer;
        this.cake = cake;
        this.quantity = quantity;
        this.totalPrice = cake.getPrice() * quantity;
        this.deliveryAddress = deliveryAddress;
        this.orderType = orderType;
    }

    // Polymorphic method demonstrating OOP
    public String getOrderSummary() {
        return switch (orderType) {
            case EXPRESS -> "EXPRESS ORDER: " + cake.getName() + " x" + quantity + " (Fast delivery)";
            case PICKUP -> "PICKUP ORDER: " + cake.getName() + " x" + quantity + " (Store pickup)";
            default -> "STANDARD ORDER: " + cake.getName() + " x" + quantity;
        };
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Cake getCake() { return cake; }
    public void setCake(Cake cake) { this.cake = cake; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public OrderType getOrderType() { return orderType; }
    public void setOrderType(OrderType orderType) { this.orderType = orderType; }

    public String getDeliveryAddress() { return deliveryAddress; }
    public void setDeliveryAddress(String deliveryAddress) { this.deliveryAddress = deliveryAddress; }

    @Override
    public String toString() {
        return "Order{id=" + id + ", status=" + status + ", totalPrice=" + totalPrice + "}";
    }
}
