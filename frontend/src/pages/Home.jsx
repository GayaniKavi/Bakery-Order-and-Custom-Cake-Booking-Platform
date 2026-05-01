import { Link } from 'react-router-dom'

function Home() {
  const customer = JSON.parse(localStorage.getItem('customer') || 'null')

  return (
    <div className="container">
      <div className="hero">
        <h1>Welcome to Bakery Platform</h1>
        <p>Order delicious cakes or book a custom cake for your special occasion!</p>
        {customer ? (
          <>
            <Link to="/cakes" className="btn">Browse Cakes</Link>
            <Link to="/custom-cakes" className="btn">Book Custom Cake</Link>
          </>
        ) : (
          <>
            <Link to="/register" className="btn">Get Started</Link>
            <Link to="/login" className="btn">Login</Link>
          </>
        )}
      </div>

      <h2 style={{ color: '#8B4513', textAlign: 'center', marginBottom: '0.5rem' }}>
        What We Offer
      </h2>
      <div className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">🎂</div>
          <h3>Birthday Cakes</h3>
          <p>Celebrate birthdays with our themed birthday cakes in various sizes and flavors.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💍</div>
          <h3>Wedding Cakes</h3>
          <p>Elegant multi-tier wedding cakes with custom decoration styles.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">✨</div>
          <h3>Custom Orders</h3>
          <p>Design your dream cake with our custom cake booking system.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📦</div>
          <h3>Easy Ordering</h3>
          <p>Place and track orders online with standard, express, or pickup delivery.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
