import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateCustomer, deleteCustomer } from '../services/customerService'

function Profile() {
  const navigate = useNavigate()
  const customer = JSON.parse(localStorage.getItem('customer') || 'null')
  const [form, setForm] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    address: customer?.address || '',
    password: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  if (!customer) { navigate('/login'); return null }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await updateCustomer(customer.id, form)
      localStorage.setItem('customer', JSON.stringify(res.data))
      setSuccess('Profile updated successfully!')
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete your account? This cannot be undone.')) return
    try {
      await deleteCustomer(customer.id)
      localStorage.removeItem('customer')
      localStorage.removeItem('isAdmin')
      navigate('/')
    } catch {
      setError('Failed to delete account.')
    }
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Profile</h1>
      </div>
      <div className="card" style={{ maxWidth: '600px' }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-group">
          <label>Email (cannot change)</label>
          <input value={customer.email} disabled style={{ background: '#f5f5f5' }} />
        </div>

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea name="address" value={form.address} onChange={handleChange} placeholder="Your address" />
          </div>
          <div className="form-group">
            <label>New Password (leave blank to keep current)</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="New password" />
          </div>
          <div className="btn-group">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              Delete Account
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
