import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { bookCustomCake } from '../services/customCakeService'

function CustomCakeBooking() {
  const navigate = useNavigate()
  const customer = JSON.parse(localStorage.getItem('customer') || 'null')
  const [bookingType, setBookingType] = useState('CUSTOM')
  const [form, setForm] = useState({
    description: '', size: '', flavor: '', deliveryDate: '',
    theme: '', characterName: '', photoDescription: '', printType: 'STANDARD'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  if (!customer) { navigate('/login'); return null }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        customerId: customer.id,
        type: bookingType,
        description: form.description,
        size: form.size,
        flavor: form.flavor,
        deliveryDate: form.deliveryDate,
        ...(bookingType === 'THEME' && { theme: form.theme, characterName: form.characterName }),
        ...(bookingType === 'PHOTO' && { photoDescription: form.photoDescription, printType: form.printType })
      }
      await bookCustomCake(payload)
      setSuccess('Custom cake booked successfully!')
      setTimeout(() => navigate('/custom-cakes/bookings'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to book custom cake.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Book Custom Cake</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/custom-cakes/bookings')}>
          My Bookings
        </button>
      </div>

      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="tabs">
          {[['CUSTOM', 'Custom Cake'], ['THEME', 'Theme Cake'], ['PHOTO', 'Photo Cake']].map(([val, label]) => (
            <button
              key={val}
              className={`tab-btn ${bookingType === val ? 'active' : ''}`}
              onClick={() => setBookingType(val)}
              type="button"
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Description / Special Instructions</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your dream cake in detail..." required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Size</label>
              <select name="size" value={form.size} onChange={handleChange} required>
                <option value="">Select size</option>
                <option value="Small">Small (6 inch)</option>
                <option value="Medium">Medium (8 inch)</option>
                <option value="Large">Large (10 inch)</option>
                <option value="Extra Large">Extra Large (12 inch)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Flavor</label>
              <select name="flavor" value={form.flavor} onChange={handleChange} required>
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
            <input type="date" name="deliveryDate" value={form.deliveryDate} onChange={handleChange}
              min={new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]} required />
          </div>

          {bookingType === 'THEME' && (
            <div className="form-row">
              <div className="form-group">
                <label>Theme</label>
                <input name="theme" value={form.theme} onChange={handleChange} placeholder="e.g. Superhero, Disney, Galaxy" />
              </div>
              <div className="form-group">
                <label>Character Name</label>
                <input name="characterName" value={form.characterName} onChange={handleChange} placeholder="e.g. Spider-Man, Elsa" />
              </div>
            </div>
          )}

          {bookingType === 'PHOTO' && (
            <div className="form-row">
              <div className="form-group">
                <label>Photo Description</label>
                <input name="photoDescription" value={form.photoDescription} onChange={handleChange} placeholder="Describe the photo to print" />
              </div>
              <div className="form-group">
                <label>Print Type</label>
                <select name="printType" value={form.printType} onChange={handleChange}>
                  <option value="STANDARD">Standard Print</option>
                  <option value="HD">HD Print</option>
                  <option value="EDIBLE_INK">Edible Ink</option>
                </select>
              </div>
            </div>
          )}

          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Booking...' : 'Book Custom Cake'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomCakeBooking
