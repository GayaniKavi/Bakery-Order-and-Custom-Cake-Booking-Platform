# Bakery Order and Custom Cake Booking Platform

SE1020 Object Oriented Programming Project

## Tech Stack
- **Frontend:** React.js (Vite)
- **Backend:** Spring Boot 3.2
- **Database:** MySQL
- **Version Control:** GitHub

## Project Structure

```
project-root/
├── frontend/    React.js frontend
├── backend/     Spring Boot backend
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL Server
- Maven

---

### Backend Setup

1. Create MySQL database:
```sql
CREATE DATABASE bakery_db;
```

2. Update database credentials in `backend-springboot/src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=your_password
```

3. Run the backend:
```bash
cd backend
mvn spring-boot:run
```

The backend runs on **http://localhost:8080**

---

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend runs on **http://localhost:5173**

---

## API Endpoints

### Customer APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /customers | Register customer |
| POST | /customers/login | Login customer |
| GET | /customers | Get all customers |
| GET | /customers/{id} | Get customer by ID |
| PUT | /customers/{id} | Update customer |
| DELETE | /customers/{id} | Delete customer |

### Cake APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /cakes | Add regular cake |
| POST | /cakes/birthday | Add birthday cake |
| POST | /cakes/wedding | Add wedding cake |
| GET | /cakes | Get all cakes |
| GET | /cakes/{id} | Get cake by ID |
| GET | /cakes/search?name= | Search cakes |
| PUT | /cakes/{id} | Update cake |
| DELETE | /cakes/{id} | Delete cake |

### Order APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /orders | Place order |
| GET | /orders | Get all orders |
| GET | /orders/{id} | Get order by ID |
| GET | /orders/customer/{id} | Get orders by customer |
| PUT | /orders/{id}/status | Update order status |
| DELETE | /orders/{id} | Cancel order |

### Custom Cake APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /custom-cakes | Book custom cake |
| GET | /custom-cakes | Get all bookings |
| GET | /custom-cakes/{id} | Get booking by ID |
| GET | /custom-cakes/customer/{id} | Get bookings by customer |
| PUT | /custom-cakes/{id} | Update booking |
| PUT | /custom-cakes/{id}/status | Update booking status |
| DELETE | /custom-cakes/{id} | Cancel booking |

---

## OOP Concepts Applied

### Encapsulation
- `Customer`, `Cake`, `Order`, `CustomCake` — all fields are private with getters/setters

### Inheritance
- `BirthdayCake` extends `Cake`
- `WeddingCake` extends `Cake`
- `ThemeCake` extends `CustomCake`
- `PhotoCake` extends `CustomCake`

### Polymorphism
- `Order.getOrderSummary()` behaves differently based on `OrderType` (STANDARD, EXPRESS, PICKUP)
- Spring's polymorphic dispatch via `@Service`, `@Repository` interfaces

---

## Pages

| Page | Path | Access |
|------|------|--------|
| Home | / | Public |
| Login | /login | Public |
| Register | /register | Public |
| Cake List | /cakes | Public |
| Add Cake | /cakes/add | Admin |
| Edit Cake | /cakes/edit/:id | Admin |
| Place Order | /orders | Customer |
| Order History | /orders/history | Customer |
| Custom Cake Booking | /custom-cakes | Customer |
| My Bookings | /custom-cakes/bookings | Customer |
| Profile | /profile | Customer |
| Admin Dashboard | /admin | Admin |

---

## Admin Access

Register with email `admin@bakery.com` to get admin privileges (Admin Dashboard, Add/Edit/Delete cakes, manage all orders and bookings).

---

## Class Diagram

```
Customer
    ↓ (places)
Order ──── Cake
               ├── BirthdayCake
               └── WeddingCake

Customer
    ↓ (books)
CustomCake
    ├── ThemeCake
    └── PhotoCake
```
