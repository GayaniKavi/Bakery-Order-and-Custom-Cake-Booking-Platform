import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addCake, addBirthdayCake, addWeddingCake } from '../services/cakeService'

function AddCake() {
  const navigate = useNavigate()
  const [cakeType, setCakeType] = useState('REGULAR')
  const [form, setForm] = useState({
    name: '', description: '', price: '', size: '', flavor: '',
    ageGroup: '', theme: '', tiers: '', decorationStyle: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const base = { name: form.name, description: form.description, price: parseFloat(form.price), size: form.size, flavor: form.flavor }
      if (cakeType === 'BIRTHDAY') {
        await addBirthdayCake({ ...base, ageGroup: form.ageGroup, theme: form.theme })
      } else if (cakeType === 'WEDDING') {
        await addWeddingCake({ ...base, tiers: parseInt(form.tiers), decorationStyle: form.decorationStyle })
      } else {
        await addCake(base)
      }
      navigate('/cakes')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add cake.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Add New Cake</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/cakes')}>Back</button>
      </div>
      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Cake Type</label>
            <select value={cakeType} onChange={e => setCakeType(e.target.value)}>
              <option value="REGULAR">Regular Cake</option>
              <option value="BIRTHDAY">Birthday Cake</option>
              <option value="WEDDING">Wedding Cake</option>
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Cake Name</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Chocolate Delight" required />
            </div>
            <div className="form-group">
              <label>Price (RM)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" step="0.01" min="0" required />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe the cake..." />
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

          {cakeType === 'BIRTHDAY' && (
            <div className="form-row">
              <div className="form-group">
                <label>Age Group</label>
                <select name="ageGroup" value={form.ageGroup} onChange={handleChange}>
                  <option value="">Select age group</option>
                  <option value="Kids (1-12)">Kids (1-12)</option>
                  <option value="Teens (13-19)">Teens (13-19)</option>
                  <option value="Adults (20+)">Adults (20+)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Theme</label>
                <input name="theme" value={form.theme} onChange={handleChange} placeholder="e.g. Superhero, Princess" />
              </div>
            </div>
          )}

          {cakeType === 'WEDDING' && (
            <div className="form-row">
              <div className="form-group">
                <label>Number of Tiers</label>
                <input type="number" name="tiers" value={form.tiers} onChange={handleChange} min="1" max="10" placeholder="e.g. 3" />
              </div>
              <div className="form-group">
                <label>Decoration Style</label>
                <input name="decorationStyle" value={form.decorationStyle} onChange={handleChange} placeholder="e.g. Floral, Minimalist" />
              </div>
            </div>
          )}

          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Cake'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/cakes')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCake
