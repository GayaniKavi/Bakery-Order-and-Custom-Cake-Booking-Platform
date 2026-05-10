import { useState } from 'react'
import { updateOrder } from '../services/orderService'

function EditOrderModal({ order, onClose, onUpdated }) {
  const [form, setForm] = useState({
    quantity: order.quantity,
    orderType: order.orderType,
    deliveryAddress: order.deliveryAddress || ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const unitPrice = order.cake?.price || 0
  const total = (unitPrice * form.quantity).toFixed(2)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await updateOrder(order.id, {
        quantity: parseInt(form.quantity),
        orderType: form.orderType,
        deliveryAddress: form.deliveryAddress
      })
      onUpdated(res.data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update order.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Order #{order.id}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-cake-info">
          <h3>{order.cake?.name}</h3>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>
            Unit price: RM {unitPrice.toFixed(2)}
          </p>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #f0e0d0', margin: '0.75rem 0' }} />

        <form onSubmit={handleSubmit} style={{ padding: '0 1.5rem 1.5rem' }}>
          {error && <div className="alert alert-error">{error}</div>}

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
              rows={2}
              required
            />
          </div>

          <div className="modal-total">
            <span>New Total</span>
            <span className="modal-total-price">RM {total}</span>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditOrderModal
