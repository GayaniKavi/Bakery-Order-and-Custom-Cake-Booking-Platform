import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { placeOrder } from '../services/orderService'

function OrderModal({ cake, onClose }) {
  const navigate = useNavigate()
  const customer = JSON.parse(localStorage.getItem('customer') || 'null')
  const [form, setForm] = useState({
    quantity: 1,
    deliveryAddress: customer?.address || '',
    orderType: 'STANDARD'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!cake) return null

  const total = (cake.price * form.quantity).toFixed(2)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!customer) { navigate('/login'); return }
    setError('')
    setLoading(true)
    try {
      await placeOrder({
        customerId: customer.id,
        cakeId: cake.id,
        quantity: parseInt(form.quantity),
        deliveryAddress: form.deliveryAddress,
        orderType: form.orderType
      })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to place order.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Place Order</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {success ? (
          <div className="modal-success">
            <div className="success-icon">✓</div>
            <h3>Order Placed!</h3>
            <p>Your order for <strong>{cake.name}</strong> has been placed successfully.</p>
            <div className="btn-group" style={{ justifyContent: 'center', marginTop: '1rem' }}>
              <button className="btn btn-primary" onClick={() => { navigate('/orders/history'); onClose() }}>
                View My Orders
              </button>
              <button className="btn btn-secondary" onClick={onClose}>Continue Shopping</button>
            </div>
          </div>
        ) : (
          <>
            <div className="modal-cake-info">
              <span className={`badge badge-${cake.cakeType?.toLowerCase() === 'birthday' ? 'birthday' : cake.cakeType?.toLowerCase() === 'wedding' ? 'wedding' : 'regular'}`}>
                {cake.cakeType === 'BIRTHDAY' ? 'Birthday' : cake.cakeType === 'WEDDING' ? 'Wedding' : 'Regular'}
              </span>
              <h3>{cake.name}</h3>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>{cake.description}</p>
              <p style={{ fontSize: '0.85rem', color: '#888' }}>Size: {cake.size} &nbsp;|&nbsp; Flavor: {cake.flavor}</p>
              <div className="cake-price">RM {cake.price?.toFixed(2)} per cake</div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #f0e0d0', margin: '1rem 0' }} />

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    required
                  />
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
                <textarea
                  name="deliveryAddress"
                  value={form.deliveryAddress}
                  onChange={handleChange}
                  placeholder="Enter delivery address..."
                  required
                  rows={2}
                />
              </div>

              <div className="modal-total">
                <span>Total</span>
                <span className="modal-total-price">RM {total}</span>
              </div>

              <div className="btn-group">
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                  {loading ? 'Placing Order...' : 'Confirm Order'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderModal
