# Bakery Order and Custom Cake Booking Platform - Project Documentation

## 1. Project Overview

The Bakery Order and Custom Cake Booking Platform is a full-stack web application for managing bakery cake sales and custom cake bookings.

The system allows normal customers to:

- Register and log in.
- Browse available cakes.
- Search cakes by name.
- Place cake orders.
- Edit or cancel pending orders.
- Book custom, theme, or photo cakes.
- Edit or cancel pending custom cake bookings.
- Update or delete their profile.

The system allows the admin to:

- View dashboard statistics.
- Manage cakes.
- Manage customers.
- View and update order statuses.
- View and update custom cake booking statuses.

This project is built for the SE1020 Object Oriented Programming module and demonstrates core OOP concepts such as encapsulation, inheritance, polymorphism, abstraction through layers, and object relationships.

## 2. Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, React Router, Axios |
| Backend | Java 17, Spring Boot 3.2 |
| API Style | REST API |
| Database | H2 in-memory database |
| ORM | Spring Data JPA / Hibernate |
| Build Tools | Maven, npm |

Note: The current project configuration uses H2 in-memory database, not MySQL. The database is recreated each time the backend restarts because `spring.jpa.hibernate.ddl-auto=create-drop` is configured.

## 3. Project Structure

```text
Bakery Order and Custom Cake Booking Platform/
|-- backend/
|   |-- pom.xml
|   |-- src/main/java/com/bakery/
|   |   |-- BakeryApplication.java
|   |   |-- config/
|   |   |-- controller/
|   |   |-- model/
|   |   |-- repository/
|   |   |-- service/
|   |-- src/main/resources/application.properties
|
|-- frontend/
|   |-- package.json
|   |-- vite.config.js
|   |-- src/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   |-- App.css
|   |   |-- components/
|   |   |-- pages/
|   |   |-- services/
|
|-- README.md
|-- class-diagram.md
|-- classDiagram.mmd
|-- PROJECT_DOCUMENTATION.md
```

## 4. How the System Works

The application is divided into frontend and backend.

The React frontend displays pages, forms, tables, buttons, and modal windows. When the user performs an action, such as registering, adding a cake, placing an order, or updating a booking, the frontend sends an HTTP request using Axios.

The Spring Boot backend receives the request through a controller. The controller sends the request data to a service class. The service class applies business logic, checks related data, and uses a repository to save or read data from the database.

General flow:

```text
User action
-> React page/component
-> Axios service file
-> Spring Boot controller
-> Service class
-> Repository
-> H2 database
-> Response back to React
```

Example order flow:

```text
Customer selects a cake
-> Customer enters quantity, address, and order type
-> Frontend sends POST /orders
-> OrderController receives request
-> OrderService finds Customer and Cake
-> OrderService calculates total price
-> OrderRepository saves order
-> Frontend shows success message
```

## 5. Backend Explanation

### 5.1 Main Application

`BakeryApplication.java` is the Spring Boot entry point. It starts the backend server.

```java
SpringApplication.run(BakeryApplication.class, args);
```

Backend runs on:

```text
http://localhost:8080
```

### 5.2 Configuration

`application.properties` configures:

- Application name.
- H2 database URL.
- H2 console.
- Hibernate table creation.
- Server port.

H2 console:

```text
http://localhost:8080/h2-console
```

Database JDBC URL:

```text
jdbc:h2:mem:bakerydb
```

`CorsConfig.java` allows the React frontend running on `http://localhost:5173` to call the backend API.

### 5.3 Data Initializer

`DataInitializer.java` creates sample data when the backend starts:

- Admin account:
  - Email: `admin@bakery.com`
  - Password: `admin123`
- Sample birthday cakes.
- Sample wedding cakes.
- Sample regular cakes.

## 6. Model Classes and OOP Concepts

### 6.1 Customer

`Customer` stores customer account information.

Main fields:

- `id`
- `name`
- `email`
- `password`
- `phone`
- `address`

Purpose:

- Register and log in customers.
- Store customer profile details.
- Link customers to orders and custom cake bookings.

### 6.2 Cake

`Cake` is the base class for normal bakery cakes.

Main fields:

- `id`
- `name`
- `description`
- `price`
- `size`
- `flavor`
- `cakeType`

`Cake` uses JPA inheritance:

```java
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "cake_type")
```

This means regular, birthday, and wedding cakes are stored in one database table called `cakes`.

### 6.3 BirthdayCake

`BirthdayCake` extends `Cake`.

Extra fields:

- `ageGroup`
- `theme`

Example:

```text
Superhero Blast, Chocolate, Kids, Superhero theme
```

### 6.4 WeddingCake

`WeddingCake` extends `Cake`.

Extra fields:

- `tiers`
- `decorationStyle`

Example:

```text
Classic Elegance, Vanilla, 3 tiers, Floral style
```

### 6.5 Order

`Order` stores normal cake orders.

Main fields:

- `id`
- `customer`
- `cake`
- `quantity`
- `totalPrice`
- `orderDate`
- `status`
- `orderType`
- `deliveryAddress`

Order statuses:

- `PENDING`
- `CONFIRMED`
- `DELIVERED`
- `CANCELLED`

Order types:

- `STANDARD`
- `EXPRESS`
- `PICKUP`

The `getOrderSummary()` method demonstrates polymorphism-like behavior using order type:

```java
public String getOrderSummary() {
    return switch (orderType) {
        case EXPRESS -> "EXPRESS ORDER: " + cake.getName() + " x" + quantity + " (Fast delivery)";
        case PICKUP -> "PICKUP ORDER: " + cake.getName() + " x" + quantity + " (Store pickup)";
        default -> "STANDARD ORDER: " + cake.getName() + " x" + quantity;
    };
}
```

### 6.6 CustomCake

`CustomCake` is the base class for custom cake bookings.

Main fields:

- `id`
- `customer`
- `description`
- `size`
- `flavor`
- `estimatedPrice`
- `deliveryDate`
- `bookingDate`
- `status`
- `customType`

Booking statuses:

- `PENDING`
- `APPROVED`
- `IN_PROGRESS`
- `READY`
- `CANCELLED`

### 6.7 ThemeCake

`ThemeCake` extends `CustomCake`.

Extra fields:

- `theme`
- `characterName`

Example:

```text
Galaxy cake with astronaut character
```

### 6.8 PhotoCake

`PhotoCake` extends `CustomCake`.

Extra fields:

- `photoDescription`
- `printType`

Example print types:

- `STANDARD`
- `HD`
- `EDIBLE_INK`

## 7. OOP Concepts Used

### 7.1 Encapsulation

All model fields are private and accessed using getters and setters.

Example:

```java
private String name;

public String getName() {
    return name;
}

public void setName(String name) {
    this.name = name;
}
```

This protects direct access to data and keeps object state controlled.

### 7.2 Inheritance

Inheritance is used for cake types.

```text
Cake
|-- BirthdayCake
|-- WeddingCake
```

Inheritance is also used for custom cake types.

```text
CustomCake
|-- ThemeCake
|-- PhotoCake
```

This reduces duplication because shared fields are kept in the parent class.

### 7.3 Polymorphism

The system stores different cake objects through the parent `Cake` type.

For example, the same `CakeRepository` can save:

- `Cake`
- `BirthdayCake`
- `WeddingCake`

The same `CustomCakeRepository` can save:

- `CustomCake`
- `ThemeCake`
- `PhotoCake`

The `Order.getOrderSummary()` method also returns different output depending on the selected `OrderType`.

### 7.4 Abstraction

The system separates responsibilities into layers:

- Controller layer handles HTTP requests.
- Service layer handles business logic.
- Repository layer handles database operations.
- Model layer represents data objects.

This hides complex database operations behind simple method calls such as:

```java
cakeRepository.findAll();
orderRepository.save(order);
```

### 7.5 Association

The project has object relationships:

```text
Customer 1 -> many Orders
Cake 1 -> many Orders
Customer 1 -> many CustomCake bookings
```

In code:

```java
@ManyToOne
private Customer customer;

@ManyToOne
private Cake cake;
```

## 8. Backend Layers

### 8.1 Controller Layer

Controllers expose REST endpoints.

| Controller | Purpose |
| --- | --- |
| `CustomerController` | Register, login, view, update, delete customers |
| `CakeController` | Add, view, search, update, delete cakes |
| `OrderController` | Place, view, update, cancel orders |
| `CustomCakeController` | Book, view, update, cancel custom cake bookings |

### 8.2 Service Layer

Services contain business logic.

| Service | Purpose |
| --- | --- |
| `CustomerService` | Checks duplicate emails, login validation, customer updates |
| `CakeService` | Cake CRUD, search, filter by type |
| `OrderService` | Finds customer and cake, calculates total, updates status |
| `CustomCakeService` | Creates custom/theme/photo bookings, updates status |

### 8.3 Repository Layer

Repositories use Spring Data JPA to communicate with the database.

| Repository | Main Methods |
| --- | --- |
| `CustomerRepository` | `findByEmail`, `existsByEmail` |
| `CakeRepository` | `findByNameContainingIgnoreCase`, `findByCakeType` |
| `OrderRepository` | `findByCustomerId`, `findByStatus` |
| `CustomCakeRepository` | `findByCustomerId`, `findByStatus` |

## 9. Frontend Explanation

The frontend is a React application created with Vite.

Frontend runs on:

```text
http://localhost:5173
```

### 9.1 Main Files

| File | Purpose |
| --- | --- |
| `main.jsx` | Mounts React app |
| `App.jsx` | Defines application routes |
| `App.css` | Contains global styling |
| `services/api.js` | Creates Axios instance |

### 9.2 Frontend Services

Frontend service files call backend endpoints.

| Service File | Purpose |
| --- | --- |
| `customerService.js` | Customer register, login, update, delete |
| `cakeService.js` | Cake add, fetch, search, update, delete |
| `orderService.js` | Order place, fetch, update, cancel |
| `customCakeService.js` | Custom cake booking CRUD and status updates |

### 9.3 Pages

| Page | Route | Purpose |
| --- | --- | --- |
| `Home.jsx` | `/` | Landing page with main options |
| `Login.jsx` | `/login` | Customer/admin login |
| `Register.jsx` | `/register` | Customer registration |
| `CakeList.jsx` | `/cakes` | Shows cake catalogue and search |
| `AddCake.jsx` | `/cakes/add` | Admin adds regular, birthday, or wedding cakes |
| `EditCake.jsx` | `/cakes/edit/:id` | Admin edits cake details |
| `OrderPage.jsx` | `/orders` | Customer places an order from form |
| `OrderHistory.jsx` | `/orders/history` | Customer views, edits, cancels orders |
| `CustomCakeBooking.jsx` | `/custom-cakes` | Customer books custom/theme/photo cake |
| `BookingDetails.jsx` | `/custom-cakes/bookings` | Customer views, edits, cancels bookings |
| `Profile.jsx` | `/profile` | Customer updates or deletes account |
| `AdminDashboard.jsx` | `/admin` | Admin manages system data |

### 9.4 Components

| Component | Purpose |
| --- | --- |
| `Navbar.jsx` | Main navigation and logout |
| `OrderModal.jsx` | Popup order form from cake catalogue |
| `EditOrderModal.jsx` | Popup form to edit pending orders |

### 9.5 Local Storage

The frontend stores logged-in customer data in browser local storage.

Keys used:

- `customer`
- `isAdmin`

Admin is detected when the email is:

```text
admin@bakery.com
```

## 10. Full CRUD Operations

CRUD means:

- Create
- Read
- Update
- Delete

The project contains several CRUD modules. The two main full CRUD modules are Cake Management and Customer Management. Orders and Custom Cake Bookings also support create/read/update/cancel behavior.

## 11. CRUD 1 - Cake Management

Cake Management is mainly used by the admin, while customers can read and order cakes.

### 11.1 Create Cake

Frontend:

- Page: `AddCake.jsx`
- Service: `cakeService.js`

Backend:

- Controller: `CakeController`
- Service: `CakeService`
- Repository: `CakeRepository`

Endpoints:

| Cake Type | Method | Endpoint |
| --- | --- | --- |
| Regular Cake | POST | `/cakes` |
| Birthday Cake | POST | `/cakes/birthday` |
| Wedding Cake | POST | `/cakes/wedding` |

Example regular cake request:

```json
{
  "name": "Chocolate Fudge",
  "description": "Rich chocolate cake",
  "price": 65.00,
  "size": "Medium",
  "flavor": "Chocolate"
}
```

Example birthday cake request:

```json
{
  "name": "Princess Dream",
  "description": "Princess themed cake",
  "price": 90.00,
  "size": "Large",
  "flavor": "Strawberry",
  "ageGroup": "Kids (1-12)",
  "theme": "Princess"
}
```

### 11.2 Read Cakes

Customers and admin can view cakes.

Endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/cakes` | Get all cakes |
| GET | `/cakes/{id}` | Get cake by ID |
| GET | `/cakes/search?name=value` | Search cakes by name |
| GET | `/cakes/type/{type}` | Filter cakes by type |

Frontend page:

- `CakeList.jsx`

### 11.3 Update Cake

Admin can update cake details.

Endpoint:

```text
PUT /cakes/{id}
```

Frontend page:

- `EditCake.jsx`

Backend logic:

- Find cake by ID.
- Update name, description, price, size, and flavor.
- Save the updated cake.

### 11.4 Delete Cake

Admin can delete a cake.

Endpoint:

```text
DELETE /cakes/{id}
```

Frontend locations:

- `CakeList.jsx`
- `AdminDashboard.jsx`

Backend logic:

- Call `cakeRepository.deleteById(id)`.

## 12. CRUD 2 - Customer Management

Customer Management is used by customers and admin.

### 12.1 Create Customer

New customers register using the registration page.

Endpoint:

```text
POST /customers
```

Frontend:

- Page: `Register.jsx`
- Service: `registerCustomer()`

Example request:

```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "password": "123456",
  "phone": "0771234567",
  "address": "Colombo"
}
```

Backend validation:

- Email must not already exist.
- Email must be valid.
- Name, email, and password are required.

### 12.2 Read Customers

Endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/customers` | Get all customers |
| GET | `/customers/{id}` | Get one customer |

Frontend locations:

- `AdminDashboard.jsx`
- `Profile.jsx`

### 12.3 Update Customer

Customers can update:

- Name
- Phone
- Address
- Password

Endpoint:

```text
PUT /customers/{id}
```

Frontend page:

- `Profile.jsx`

Backend logic:

- Find customer by ID.
- Update profile fields.
- Update password only if a new password is provided.

### 12.4 Delete Customer

Customers can delete their own account. Admin can delete customer accounts except the admin account.

Endpoint:

```text
DELETE /customers/{id}
```

Frontend locations:

- `Profile.jsx`
- `AdminDashboard.jsx`

## 13. Other Main Functions

## 14. Order Management

Orders are used when a customer buys an existing cake from the catalogue.

### 14.1 Place Order

Endpoint:

```text
POST /orders
```

Example request:

```json
{
  "customerId": 1,
  "cakeId": 2,
  "quantity": 3,
  "deliveryAddress": "Colombo",
  "orderType": "STANDARD"
}
```

Backend process:

- Find the customer.
- Find the cake.
- Convert order type to enum.
- Calculate total price as `cake.price * quantity`.
- Save order with `PENDING` status.

### 14.2 View Orders

Endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/orders` | Admin gets all orders |
| GET | `/orders/{id}` | Get order by ID |
| GET | `/orders/customer/{customerId}` | Customer gets own orders |

### 14.3 Update Order

Customers can edit only pending orders.

Endpoint:

```text
PUT /orders/{id}
```

Editable fields:

- Quantity
- Delivery address
- Order type

If quantity changes, the total price is recalculated.

### 14.4 Update Order Status

Admin can update order status.

Endpoint:

```text
PUT /orders/{id}/status
```

Example request:

```json
{
  "status": "CONFIRMED"
}
```

### 14.5 Cancel Order

Endpoint:

```text
DELETE /orders/{id}
```

Important: The order is not physically removed from the database. The status is changed to `CANCELLED`.

## 15. Custom Cake Booking Management

Custom cake booking is used when a customer wants a cake that is not already in the catalogue.

### 15.1 Create Booking

Endpoint:

```text
POST /custom-cakes
```

Supported booking types:

- `CUSTOM`
- `THEME`
- `PHOTO`

Example custom cake request:

```json
{
  "customerId": 1,
  "type": "CUSTOM",
  "description": "Two-layer chocolate cake with blue flowers",
  "size": "Large",
  "flavor": "Chocolate",
  "deliveryDate": "2026-06-01"
}
```

Example theme cake request:

```json
{
  "customerId": 1,
  "type": "THEME",
  "description": "Birthday cake with cartoon decoration",
  "size": "Medium",
  "flavor": "Vanilla",
  "deliveryDate": "2026-06-01",
  "theme": "Superhero",
  "characterName": "Spider-Man"
}
```

Example photo cake request:

```json
{
  "customerId": 1,
  "type": "PHOTO",
  "description": "Photo cake for anniversary",
  "size": "Medium",
  "flavor": "Red Velvet",
  "deliveryDate": "2026-06-01",
  "photoDescription": "Couple photo on top",
  "printType": "HD"
}
```

### 15.2 Read Bookings

Endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/custom-cakes` | Admin gets all bookings |
| GET | `/custom-cakes/{id}` | Get booking by ID |
| GET | `/custom-cakes/customer/{customerId}` | Customer gets own bookings |

### 15.3 Update Booking

Customers can update booking details.

Endpoint:

```text
PUT /custom-cakes/{id}
```

Editable fields:

- Description
- Size
- Flavor
- Delivery date
- Estimated price

### 15.4 Update Booking Status

Admin can update booking status.

Endpoint:

```text
PUT /custom-cakes/{id}/status
```

Example request:

```json
{
  "status": "APPROVED"
}
```

### 15.5 Cancel Booking

Endpoint:

```text
DELETE /custom-cakes/{id}
```

Important: The booking is not physically removed from the database. The status is changed to `CANCELLED`.

## 16. API Endpoint Summary

### 16.1 Customer APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/customers` | Register customer |
| POST | `/customers/login` | Login customer |
| GET | `/customers` | Get all customers |
| GET | `/customers/{id}` | Get customer by ID |
| PUT | `/customers/{id}` | Update customer |
| DELETE | `/customers/{id}` | Delete customer |

### 16.2 Cake APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/cakes` | Add regular cake |
| POST | `/cakes/birthday` | Add birthday cake |
| POST | `/cakes/wedding` | Add wedding cake |
| GET | `/cakes` | Get all cakes |
| GET | `/cakes/{id}` | Get cake by ID |
| GET | `/cakes/search?name=value` | Search cakes |
| GET | `/cakes/type/{type}` | Filter cakes by type |
| PUT | `/cakes/{id}` | Update cake |
| DELETE | `/cakes/{id}` | Delete cake |

### 16.3 Order APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/orders` | Place order |
| GET | `/orders` | Get all orders |
| GET | `/orders/{id}` | Get order by ID |
| GET | `/orders/customer/{customerId}` | Get customer orders |
| PUT | `/orders/{id}` | Update pending order |
| PUT | `/orders/{id}/status` | Update order status |
| DELETE | `/orders/{id}` | Cancel order |

### 16.4 Custom Cake APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/custom-cakes` | Book custom cake |
| GET | `/custom-cakes` | Get all bookings |
| GET | `/custom-cakes/{id}` | Get booking by ID |
| GET | `/custom-cakes/customer/{customerId}` | Get customer bookings |
| PUT | `/custom-cakes/{id}` | Update booking |
| PUT | `/custom-cakes/{id}/status` | Update booking status |
| DELETE | `/custom-cakes/{id}` | Cancel booking |

## 17. Database Tables

Because the project uses JPA inheritance with single-table strategy, subclasses are stored in the same table as their parent class.

### 17.1 `customers`

Stores customer account details.

Important columns:

- `id`
- `name`
- `email`
- `password`
- `phone`
- `address`

### 17.2 `cakes`

Stores regular, birthday, and wedding cakes.

Important columns:

- `id`
- `name`
- `description`
- `price`
- `size`
- `flavor`
- `cake_type`
- `age_group`
- `theme`
- `tiers`
- `decoration_style`

### 17.3 `orders`

Stores customer cake orders.

Important columns:

- `id`
- `customer_id`
- `cake_id`
- `quantity`
- `total_price`
- `order_date`
- `status`
- `order_type`
- `delivery_address`

### 17.4 `custom_cakes`

Stores custom, theme, and photo cake bookings.

Important columns:

- `id`
- `customer_id`
- `description`
- `size`
- `flavor`
- `estimated_price`
- `delivery_date`
- `booking_date`
- `status`
- `custom_type`
- `theme`
- `character_name`
- `photo_description`
- `print_type`

## 18. User Roles

### 18.1 Customer

Customer can:

- Register.
- Login.
- Browse/search cakes.
- Place orders.
- View order history.
- Edit pending orders.
- Cancel orders.
- Book custom cakes.
- Edit bookings.
- Cancel bookings.
- Update profile.
- Delete account.

### 18.2 Admin

Admin can:

- Login using `admin@bakery.com`.
- View dashboard statistics.
- Add/edit/delete cakes.
- View all customers.
- Delete customer accounts except admin.
- View all orders.
- Update order statuses.
- View all custom cake bookings.
- Update booking statuses.

## 19. Admin Login

Default admin account:

```text
Email: admin@bakery.com
Password: admin123
```

The admin account is created automatically by `DataInitializer.java`.

## 20. Setup Instructions

### 20.1 Prerequisites

Install:

- Java 17 or newer.
- Maven.
- Node.js 18 or newer.
- npm.

### 20.2 Run Backend

```bash
cd backend
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

H2 console:

```text
http://localhost:8080/h2-console
```

H2 login:

```text
JDBC URL: jdbc:h2:mem:bakerydb
Username: sa
Password: leave empty
```

### 20.3 Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## 21. Main User Workflows

### 21.1 Customer Registration and Login

1. User opens Register page.
2. User enters name, email, password, phone, and address.
3. Frontend sends data to `POST /customers`.
4. Backend checks if email already exists.
5. Customer is saved.
6. User logs in through `POST /customers/login`.
7. Customer data is stored in local storage.

### 21.2 Cake Ordering

1. Customer opens Cake Catalogue.
2. Customer searches or selects a cake.
3. Customer clicks Order.
4. Order modal opens.
5. Customer enters quantity, delivery address, and order type.
6. Frontend sends order to `POST /orders`.
7. Backend calculates total price.
8. Order is saved with `PENDING` status.
9. Customer can view it in My Orders.

### 21.3 Custom Cake Booking

1. Customer opens Book Custom Cake page.
2. Customer chooses booking type: Custom, Theme, or Photo.
3. Customer enters size, flavor, description, and delivery date.
4. Frontend sends booking to `POST /custom-cakes`.
5. Backend creates the correct object type.
6. Booking is saved with `PENDING` status.
7. Admin can update status later.

### 21.4 Admin Management

1. Admin logs in.
2. Admin opens dashboard.
3. Admin can view totals, orders, bookings, customers, and cakes.
4. Admin can update order status.
5. Admin can update booking status.
6. Admin can add, edit, or delete cakes.

## 22. Class Diagram Summary

```text
Customer
|-- places many Orders
|-- books many CustomCake bookings

Cake
|-- BirthdayCake
|-- WeddingCake

CustomCake
|-- ThemeCake
|-- PhotoCake

Order
|-- belongs to one Customer
|-- belongs to one Cake
```

## 23. Strengths of the Project

- Clear separation between frontend and backend.
- REST API structure is easy to understand.
- Uses object-oriented models with inheritance.
- Supports admin and customer workflows.
- Includes full CRUD for cakes and customers.
- Includes order management and custom booking management.
- Uses sample seed data for easy testing.
- Uses H2 database, so no external database installation is required.

## 24. Limitations and Possible Improvements

Current limitations:

- Passwords are stored as plain text.
- Admin detection is based on email in frontend local storage.
- H2 database is in-memory, so data resets after restart.
- No JWT/session-based authentication.
- Cake image upload is not implemented.
- Payment processing is not implemented.
- Estimated price for custom cakes is not calculated automatically.

Possible improvements:

- Add Spring Security with JWT authentication.
- Hash passwords using BCrypt.
- Replace H2 with MySQL for production.
- Add image upload for cake catalogue.
- Add payment gateway integration.
- Add validation for future delivery dates in backend.
- Add unit and integration tests.
- Add admin role field in the customer table.

## 25. Conclusion

The Bakery Order and Custom Cake Booking Platform is a complete full-stack OOP project that supports customer registration, cake browsing, cake ordering, custom cake booking, and admin management.

The backend demonstrates Java OOP concepts through model classes, inheritance, relationships, and layered architecture. The frontend provides a usable React interface for customers and admin users. Together, both parts form a practical bakery management system suitable for demonstrating full-stack development and object-oriented programming concepts.
