import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllCustomers, deleteCustomer } from '../services/customerService'
import { getAllCakes, deleteCake } from '../services/cakeService'
import { getAllOrders, updateOrderStatus } from '../services/orderService'
import { getAllBookings, updateBookingStatus } from '../services/customCakeService'

function AdminDashboard() {
  const navigate = useNavigate()
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  const [tab, setTab] = useState('overview')
  const [customers, setCustomers] = useState([])
  const [cakes, setCakes] = useState([])
  const [orders, setOrders] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return }
    loadAll()
  }, [])

  const loadAll = async () => {
    setLoading(true)
    try {
      const [custRes, cakeRes, ordRes, bookRes] = await Promise.all([
        getAllCustomers(), getAllCakes(), getAllOrders(), getAllBookings()
      ])
      setCustomers(custRes.data)
      setCakes(cakeRes.data)
      setOrders(ordRes.data)
      setBookings(bookRes.data)
    } catch {
      setMessage('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  // Computed stats
  const totalRevenue = orders
    .filter(o => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0)

  const pendingOrders = orders.filter(o => o.status === 'PENDING').length
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length

  const handleOrderStatus = async (id, status) => {
    try {
      await updateOrderStatus(id, status)
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
    } catch { setMessage('Failed to update order status.') }
  }

  const handleBookingStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status)
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b))
    } catch { setMessage('Failed to update booking status.') }
  }

  const handleDeleteCustomer = async (id, email) => {
    if (email === 'admin@bakery.com') { setMessage('Cannot delete the admin account.'); return }
    if (!window.confirm('Delete this customer account?')) return
    try {
      await deleteCustomer(id)
      setCustomers(customers.filter(c => c.id !== id))
      setMessage('Customer deleted.')
    } catch { setMessage('Failed to delete customer.') }
  }

  const handleDeleteCake = async (id) => {
    if (!window.confirm('Delete this cake?')) return
    try {
      await deleteCake(id)
      setCakes(cakes.filter(c => c.id !== id))
      setMessage('Cake deleted.')
    } catch { setMessage('Failed to delete cake.') }
  }

  const getStatusClass = (status) => `status-badge status-${status?.toLowerCase()}`

  const getBadge = (type) => {
    if (type === 'BIRTHDAY') return <span className="badge badge-birthday">Birthday</span>
    if (type === 'WEDDING') return <span className="badge badge-wedding">Wedding</span>
    return <span className="badge badge-regular">Regular</span>
  }

  const TABS = [
    ['overview', 'Overview'],
    ['orders', `Orders ${pendingOrders > 0 ? `(${pendingOrders} pending)` : ''}`],
    ['bookings', `Custom Bookings ${pendingBookings > 0 ? `(${pendingBookings} pending)` : ''}`],
    ['customers', 'Customers'],
    ['cakes', 'Cakes'],
  ]

  if (loading) return <div className="loading">Loading admin dashboard...</div>

  return (
    <div className="container">
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <button className="btn btn-primary" onClick={() => navigate('/cakes/add')}>+ Add Cake</button>
      </div>

      {message && (
        <div className="alert alert-info" style={{ cursor: 'pointer' }} onClick={() => setMessage('')}>
          {message} <span style={{ float: 'right' }}>✕</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs">
        {TABS.map(([val, label]) => (
          <button key={val} className={`tab-btn ${tab === val ? 'active' : ''}`} onClick={() => setTab(val)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-number">{customers.length}</div>
              <div className="stat-label">Total Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{cakes.length}</div>
              <div className="stat-label">Cakes Listed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{orders.length}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{pendingOrders}</div>
              <div className="stat-label">Pending Orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{bookings.length}</div>
              <div className="stat-label">Custom Bookings</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ fontSize: '1.6rem' }}>
                RM {totalRevenue.toFixed(2)}
              </div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>

          {/* Recent orders */}
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: '#8B4513' }}>Recent Orders</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setTab('orders')}>View All</button>
            </div>
            {orders.length === 0 ? (
              <p style={{ color: '#888' }}>No orders yet.</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>#</th><th>Customer</th><th>Cake</th><th>Total</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id}>
                        <td>{o.id}</td>
                        <td>{o.customer?.name}</td>
                        <td>{o.cake?.name}</td>
                        <td>RM {o.totalPrice?.toFixed(2)}</td>
                        <td><span className={getStatusClass(o.status)}>{o.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pending bookings */}
          {pendingBookings > 0 && (
            <div className="card" style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ color: '#8B4513' }}>Pending Custom Bookings</h3>
                <button className="btn btn-secondary btn-sm" onClick={() => setTab('bookings')}>View All</button>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr><th>#</th><th>Customer</th><th>Type</th><th>Delivery</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {bookings.filter(b => b.status === 'PENDING').map(b => (
                      <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>{b.customer?.name}</td>
                        <td>{b.customType}</td>
                        <td>{b.deliveryDate}</td>
                        <td><span className={getStatusClass(b.status)}>{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── ORDERS ── */}
      {tab === 'orders' && (
        orders.length === 0 ? <div className="empty-state"><p>No orders yet.</p></div> : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Customer</th><th>Cake</th><th>Qty</th>
                  <th>Total (RM)</th><th>Type</th><th>Date</th><th>Status</th><th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.customer?.name}</td>
                    <td>{o.cake?.name}</td>
                    <td>{o.quantity}</td>
                    <td>{o.totalPrice?.toFixed(2)}</td>
                    <td>{o.orderType}</td>
                    <td>{o.orderDate}</td>
                    <td><span className={getStatusClass(o.status)}>{o.status}</span></td>
                    <td>
                      <select
                        value={o.status}
                        onChange={e => handleOrderStatus(o.id, e.target.value)}
                        style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                      >
                        {['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* ── CUSTOM BOOKINGS ── */}
      {tab === 'bookings' && (
        bookings.length === 0 ? <div className="empty-state"><p>No custom bookings yet.</p></div> : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Customer</th><th>Type</th><th>Size</th>
                  <th>Flavor</th><th>Delivery Date</th><th>Status</th><th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.customer?.name}</td>
                    <td>{b.customType}</td>
                    <td>{b.size}</td>
                    <td>{b.flavor}</td>
                    <td>{b.deliveryDate}</td>
                    <td><span className={getStatusClass(b.status)}>{b.status}</span></td>
                    <td>
                      <select
                        value={b.status}
                        onChange={e => handleBookingStatus(b.id, e.target.value)}
                        style={{ padding: '0.3rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.85rem' }}
                      >
                        {['PENDING', 'APPROVED', 'IN_PROGRESS', 'READY', 'CANCELLED'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* ── CUSTOMERS ── */}
      {tab === 'customers' && (
        customers.length === 0 ? <div className="empty-state"><p>No customers registered.</p></div> : (
          <div className="table-container">
            <table>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Address</th><th>Action</th></tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.phone || '—'}</td>
                    <td>{c.address || '—'}</td>
                    <td>
                      {c.email !== 'admin@bakery.com' && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteCustomer(c.id, c.email)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* ── CAKES ── */}
      {tab === 'cakes' && (
        <>
          <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/cakes/add')}>+ Add Cake</button>
          </div>
          {cakes.length === 0 ? <div className="empty-state"><p>No cakes listed.</p></div> : (
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Type</th><th>Price (RM)</th><th>Size</th><th>Flavor</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {cakes.map(c => (
                    <tr key={c.id}>
                      <td>{c.id}</td>
                      <td>{c.name}</td>
                      <td>{getBadge(c.cakeType)}</td>
                      <td>{c.price?.toFixed(2)}</td>
                      <td>{c.size}</td>
                      <td>{c.flavor}</td>
                      <td>
                        <div className="btn-group">
                          <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/cakes/edit/${c.id}`)}>
                            Edit
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCake(c.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminDashboard
