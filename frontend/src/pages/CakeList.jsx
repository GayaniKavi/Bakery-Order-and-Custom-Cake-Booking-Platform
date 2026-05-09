import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllCakes, deleteCake, searchCakes } from '../services/cakeService'
import OrderModal from '../components/OrderModal'

function CakeList() {
  const navigate = useNavigate()
  const [cakes, setCakes] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [selectedCake, setSelectedCake] = useState(null)
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  const customer = JSON.parse(localStorage.getItem('customer') || 'null')

  useEffect(() => { fetchCakes() }, [])

  const fetchCakes = async () => {
    setLoading(true)
    try {
      const res = await getAllCakes()
      setCakes(res.data)
    } catch {
      setMessage('Failed to load cakes.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!search.trim()) { fetchCakes(); return }
    try {
      const res = await searchCakes(search)
      setCakes(res.data)
    } catch {
      setMessage('Search failed.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this cake?')) return
    try {
      await deleteCake(id)
      setCakes(cakes.filter(c => c.id !== id))
      setMessage('Cake deleted successfully.')
    } catch {
      setMessage('Failed to delete cake.')
    }
  }

  const handleOrderClick = (cake) => {
    if (!customer) { navigate('/login'); return }
    setSelectedCake(cake)
  }

  const getBadgeClass = (type) => {
    if (type === 'BIRTHDAY') return 'badge badge-birthday'
    if (type === 'WEDDING') return 'badge badge-wedding'
    return 'badge badge-regular'
  }

  const getTypeLabel = (type) => {
    if (type === 'BIRTHDAY') return 'Birthday'
    if (type === 'WEDDING') return 'Wedding'
    return 'Regular'
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Cake Catalogue</h1>
        {isAdmin && (
          <Link to="/cakes/add" className="btn btn-primary">+ Add Cake</Link>
        )}
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search cakes by name..."
          style={{ flex: 1, padding: '0.6rem 0.8rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem' }}
        />
        <button type="submit" className="btn btn-primary">Search</button>
        <button type="button" className="btn btn-secondary" onClick={() => { setSearch(''); fetchCakes() }}>Clear</button>
      </form>

      {loading ? (
        <div className="loading">Loading cakes...</div>
      ) : cakes.length === 0 ? (
        <div className="empty-state"><p>No cakes found.</p></div>
      ) : (
        <div className="card-grid">
          {cakes.map(cake => (
            <div key={cake.id} className="cake-card">
              <span className={getBadgeClass(cake.cakeType)}>{getTypeLabel(cake.cakeType)}</span>
              <h3>{cake.name}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{cake.description}</p>
              <div className="cake-price">RM {cake.price?.toFixed(2)}</div>
              <p style={{ fontSize: '0.85rem', color: '#888' }}>
                Size: {cake.size} | Flavor: {cake.flavor}
              </p>
              {cake.cakeType === 'BIRTHDAY' && (
                <p style={{ fontSize: '0.85rem', color: '#888' }}>
                  Theme: {cake.theme} | Age Group: {cake.ageGroup}
                </p>
              )}
              {cake.cakeType === 'WEDDING' && (
                <p style={{ fontSize: '0.85rem', color: '#888' }}>
                  Tiers: {cake.tiers} | Style: {cake.decorationStyle}
                </p>
              )}
              <div className="btn-group" style={{ marginTop: '1rem' }}>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handleOrderClick(cake)}
                >
                  Order
                </button>
                {isAdmin && (
                  <>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/cakes/edit/${cake.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(cake.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCake && (
        <OrderModal cake={selectedCake} onClose={() => setSelectedCake(null)} />
      )}
    </div>
  )
}

export default CakeList
