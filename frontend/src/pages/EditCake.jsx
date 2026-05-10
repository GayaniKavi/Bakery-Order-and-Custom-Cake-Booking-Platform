import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCakeById, updateCake } from '../services/cakeService'

function EditCake() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', description: '', price: '', size: '', flavor: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getCakeById(id).then(res => {
      const c = res.data
      setForm({ name: c.name, description: c.description || '', price: c.price, size: c.size || '', flavor: c.flavor || '' })
    }).catch(() => setError('Failed to load cake.'))
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateCake(id, { ...form, price: parseFloat(form.price) })
      navigate('/cakes')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update cake.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Edit Cake</h1>
        <button className="btn btn-secondary" onClick={() => navigate('/cakes')}>Back</button>
      </div>
      <div className="card">
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Cake Name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Price (RM)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} step="0.01" min="0" required />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Size</label>
              <select name="size" value={form.size} onChange={handleChange}>
                <option value="">Select size</option>
                <option value="Small">Small (6 inch)</option>
                <option value="Medium">Medium (8 inch)</option>
                <option value="Large">Large (10 inch)</option>
                <option value="Extra Large">Extra Large (12 inch)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Flavor</label>
              <select name="flavor" value={form.flavor} onChange={handleChange}>
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
          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Cake'}
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

export default EditCake
