package com.bakery.service;

import com.bakery.model.Cake;
import com.bakery.model.Customer;
import com.bakery.model.Order;
import com.bakery.repository.CakeRepository;
import com.bakery.repository.CustomerRepository;
import com.bakery.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private CakeRepository cakeRepository;

    public Order placeOrder(Long customerId, Long cakeId, Integer quantity,
                            String deliveryAddress, String orderType) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Cake cake = cakeRepository.findById(cakeId)
                .orElseThrow(() -> new RuntimeException("Cake not found"));

        Order.OrderType type = Order.OrderType.valueOf(orderType.toUpperCase());
        Order order = new Order(customer, cake, quantity, deliveryAddress, type);
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order updateOrderStatus(Long id, String status) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(Order.OrderStatus.valueOf(status.toUpperCase()));
            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public Order updateOrder(Long id, Integer quantity, String deliveryAddress, String orderType) {
        return orderRepository.findById(id).map(order -> {
            if (order.getStatus() != Order.OrderStatus.PENDING) {
                throw new RuntimeException("Only PENDING orders can be edited.");
            }
            if (quantity != null && quantity > 0) {
                order.setQuantity(quantity);
                order.setTotalPrice(order.getCake().getPrice() * quantity);
            }
            if (deliveryAddress != null && !deliveryAddress.isBlank()) {
                order.setDeliveryAddress(deliveryAddress);
            }
            if (orderType != null) {
                order.setOrderType(Order.OrderType.valueOf(orderType.toUpperCase()));
            }
            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    public void cancelOrder(Long id) {
        orderRepository.findById(id).map(order -> {
            order.setStatus(Order.OrderStatus.CANCELLED);
            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }
}
