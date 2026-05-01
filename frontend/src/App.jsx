import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import CakeList from './pages/CakeList'
import AddCake from './pages/AddCake'
import EditCake from './pages/EditCake'
import OrderPage from './pages/OrderPage'
import OrderHistory from './pages/OrderHistory'
import CustomCakeBooking from './pages/CustomCakeBooking'
import BookingDetails from './pages/BookingDetails'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cakes" element={<CakeList />} />
        <Route path="/cakes/add" element={<AddCake />} />
        <Route path="/cakes/edit/:id" element={<EditCake />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/orders/history" element={<OrderHistory />} />
        <Route path="/custom-cakes" element={<CustomCakeBooking />} />
        <Route path="/custom-cakes/bookings" element={<BookingDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
