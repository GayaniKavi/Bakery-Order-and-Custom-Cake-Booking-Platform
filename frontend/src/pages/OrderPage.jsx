import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { getAllCakes } from '../services/cakeService'
import { placeOrder } from '../services/orderService'

function OrderPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const customer = JSON.parse(localStorage.getItem('customer') || 'null')

  const [cakes, setCakes] = useState([])
  const [form, setForm] = useState({
    cakeId: '',
    quantity: 1,
    deliveryAddress: customer?.address || '',
    orderType: 'STANDARD'
  })
  const [selectedCake, setSelectedCake] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!customer) { navigate('/login'); return }
    getAllCakes().then(res => {
      setCakes(res.data)
      if (location.state?.selectedCake) {
        const cake = location.state.selectedCake
        setForm(f => ({ ...f, cakeId: cake.id }))
        setSelectedCake(cake)
      }
    })
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    if (name === 'cakeId') {
      setSelectedCake(cakes.find(c => c.id === parseInt(value)) || null)
    }
  }

  const totalPrice = selectedCake ? (selectedCake.price * form.quantity).toFixed(2) : '0.00'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await placeOrder({
        customerId: customer.id,
        cakeId: parseInt(form.cakeId),
        quantity: parseInt(form.quantity),
        deliveryAddress: form.deliveryAddress,
        orderType: form.orderType
      })
      setSuccess('Order placed successfully!')
      setTimeout(() => navigate('/orders/history'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Place Order</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '1.5rem' }}>
        <div className="card">
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Cake</label>
              <select name="cakeId" value={form.cakeId} onChange={handleChange} required>
                <option value="">-- Select a cake --</option>
                {cakes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} — RM {c.price?.toFixed(2)}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Quantity</label>
                <input type="number" name="quantity" value={form.quantity} onChange={handleChange} min="1" max="20" required />
              </div>
              <div className="form-group">
                <label>Order Type</label>
                <select name="orderType" value={form.orderType} onChange={handleChange}>
                  <option value="STANDARD">Standard Delivery</option>
                  <option value="EXPRESS">Express Delivery</option>
                  <option value="PICKUP">Store Pickup</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Delivery Address</label>
              <textarea name="deliveryAddress" value={form.deliveryAddress} onChange={handleChange} placeholder="Enter delivery address" required />
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/cakes')}>
                Back to Cakes
              </button>
            </div>
          </form>
        </div>

        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ color: '#8B4513', marginBottom: '1rem' }}>Order Summary</h3>
          {selectedCake ? (
            <>
              <p><strong>Cake:</strong> {selectedCake.name}</p>
              <p><strong>Size:</strong> {selectedCake.size}</p>
              <p><strong>Flavor:</strong> {selectedCake.flavor}</p>
              <p><strong>Unit Price:</strong> RM {selectedCake.price?.toFixed(2)}</p>
              <p><strong>Quantity:</strong> {form.quantity}</p>
              <hr style={{ margin: '1rem 0', borderColor: '#eee' }} />
              <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#e65c00' }}>
                Total: RM {totalPrice}
              </p>
            </>
          ) : (
            <p style={{ color: '#888' }}>Select a cake to see summary</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderPage
