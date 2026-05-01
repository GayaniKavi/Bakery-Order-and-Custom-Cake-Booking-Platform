import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const customer = JSON.parse(localStorage.getItem('customer') || 'null')
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  const handleLogout = () => {
    localStorage.removeItem('customer')
    localStorage.removeItem('isAdmin')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Bakery Platform</Link>
      <ul className="navbar-nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/cakes">Cakes</Link></li>
        {customer && (
          <>
            <li><Link to="/orders/history">My Orders</Link></li>
            <li><Link to="/custom-cakes">Custom Cake</Link></li>
            <li><Link to="/custom-cakes/bookings">My Bookings</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </>
        )}
        {isAdmin && <li><Link to="/admin">Admin</Link></li>}
        {customer ? (
          <li>
            <span style={{ color: '#f5c18a', marginRight: '0.5rem' }}>
              Hi, {customer.name}
            </span>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar
