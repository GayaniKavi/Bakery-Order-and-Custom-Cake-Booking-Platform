import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBookingsByCustomer, cancelBooking, updateBooking } from '../services/customCakeService'

function BookingDetails() {
  const navigate = useNavigate()
  const customer = JSON.parse(localStorage.getItem('customer') || 'null')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')

  useEffect(() => {
    if (!customer) { navigate('/login'); return }
    getBookingsByCustomer(customer.id)
      .then(res => setBookings(res.data))
      .catch(() => setMessage('Failed to load bookings.'))
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return
    try {
      await cancelBooking(id)
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b))
      setMessage('Booking cancelled.')
    } catch {
      setMessage('Failed to cancel booking.')
    }
  }

  const openEdit = (booking) => {
    setEditingId(booking.id)
    setEditError('')
    setEditForm({
      description: booking.description || '',
      size: booking.size || '',
      flavor: booking.flavor || '',
      deliveryDate: booking.deliveryDate || ''
    })
  }

  const closeEdit = () => {
    setEditingId(null)
    setEditError('')
  }

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value })

  const handleEditSubmit = async (e, id) => {
    e.preventDefault()
    setEditLoading(true)
    setEditError('')
    try {
      const res = await updateBooking(id, editForm)
      setBookings(bookings.map(b => b.id === id ? { ...b, ...res.data } : b))
      setMessage('Booking updated successfully.')
      setEditingId(null)
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to update booking.')
    } finally {
      setEditLoading(false)
    }
  }

  const getStatusClass = (status) => `status-badge status-${status?.toLowerCase()}`

  const getTypeLabel = (type) => {
    if (type === 'THEME') return 'Theme Cake'
    if (type === 'PHOTO') return 'Photo Cake'
    return 'Custom Cake'
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Custom Cake Bookings</h1>
        <button className="btn btn-primary" onClick={() => navigate('/custom-cakes')}>+ New Booking</button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {loading ? (
        <div className="loading">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <p>No custom cake bookings yet.</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/custom-cakes')}>
            Book a Custom Cake
          </button>
        </div>
      ) : (
        <div>
          {bookings.map(booking => (
            <div key={booking.id} className="card" style={{ marginBottom: '1rem' }}>
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ color: '#8B4513', marginBottom: '0.5rem' }}>
                    Booking #{booking.id} — {getTypeLabel(booking.customType)}
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <span className={getStatusClass(booking.status)}>{booking.status}</span>
                  {booking.status === 'PENDING' && editingId !== booking.id && (
                    <div className="btn-group">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(booking)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleCancel(booking.id)}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* View mode */}
              {editingId !== booking.id && (
                <div style={{ marginTop: '0.5rem' }}>
                  <p><strong>Description:</strong> {booking.description}</p>
                  <p><strong>Size:</strong> {booking.size} &nbsp;|&nbsp; <strong>Flavor:</strong> {booking.flavor}</p>
                  <p><strong>Delivery Date:</strong> {booking.deliveryDate}</p>
                  <p><strong>Booked On:</strong> {booking.bookingDate}</p>
                  {booking.estimatedPrice && (
                    <p><strong>Estimated Price:</strong> RM {booking.estimatedPrice?.toFixed(2)}</p>
                  )}
                  {booking.theme && (
                    <p><strong>Theme:</strong> {booking.theme} &nbsp;|&nbsp; <strong>Character:</strong> {booking.characterName}</p>
                  )}
                  {booking.photoDescription && (
                    <p><strong>Photo:</strong> {booking.photoDescription} &nbsp;|&nbsp; <strong>Print Type:</strong> {booking.printType}</p>
                  )}
                </div>
              )}

              {/* Edit mode — inline form */}
              {editingId === booking.id && (
                <form
                  onSubmit={(e) => handleEditSubmit(e, booking.id)}
                  style={{ marginTop: '1rem', borderTop: '1px solid #f0e0d0', paddingTop: '1rem' }}
                >
                  <p style={{ fontWeight: 600, color: '#8B4513', marginBottom: '0.75rem' }}>Edit Booking</p>
                  {editError && <div className="alert alert-error">{editError}</div>}

                  <div className="form-group">
                    <label>Description / Special Instructions</label>
                    <textarea
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      rows={2}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Size</label>
                      <select name="size" value={editForm.size} onChange={handleEditChange} required>
                        <option value="">Select size</option>
                        <option value="Small">Small (6 inch)</option>
                        <option value="Medium">Medium (8 inch)</option>
                        <option value="Large">Large (10 inch)</option>
                        <option value="Extra Large">Extra Large (12 inch)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Flavor</label>
                      <select name="flavor" value={editForm.flavor} onChange={handleEditChange} required>
                        <option value="">Select flavor</option>
                        <option value="Chocolate">Chocolate</option>
                        <option value="Vanilla">Vanilla</option>
                        <option value="Strawberry">Strawberry</option>
                        <option value="Red Velvet">Red Velvet</option>
                        <option value="Lemon">Lemon</option>
                        <option value="Butterscotch">Butterscotch</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Delivery Date</label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={editForm.deliveryDate}
                      onChange={handleEditChange}
                      min={new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]}
                      required
                    />
                  </div>

                  <div className="btn-group">
                    <button type="submit" className="btn btn-primary" disabled={editLoading}>
                      {editLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={closeEdit}>
                      Discard
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BookingDetails
