import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrdersByCustomer, cancelOrder } from '../services/orderService'
import EditOrderModal from '../components/EditOrderModal'

function OrderHistory() {
  const navigate = useNavigate()
  const customer = JSON.parse(localStorage.getItem('customer') || 'null')
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [editingOrder, setEditingOrder] = useState(null)

  useEffect(() => {
    if (!customer) { navigate('/login'); return }
    getOrdersByCustomer(customer.id)
      .then(res => setOrders(res.data))
      .catch(() => setMessage('Failed to load orders.'))
      .finally(() => setLoading(false))
  }, [])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return
    try {
      await cancelOrder(id)
      setOrders(orders.map(o => o.id === id ? { ...o, status: 'CANCELLED' } : o))
      setMessage('Order cancelled.')
    } catch {
      setMessage('Failed to cancel order.')
    }
  }

  const handleUpdated = (updatedOrder) => {
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o))
    setMessage('Order updated successfully.')
  }

  const getStatusClass = (status) => `status-badge status-${status?.toLowerCase()}`

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Orders</h1>
        <button className="btn btn-primary" onClick={() => navigate('/cakes')}>Browse Cakes</button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <p>You have no orders yet.</p>
          <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/cakes')}>
            Browse Cakes
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Cake</th>
                <th>Qty</th>
                <th>Total (RM)</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.cake?.name}</td>
                  <td>{order.quantity}</td>
                  <td>{order.totalPrice?.toFixed(2)}</td>
                  <td>{order.orderType}</td>
                  <td>{order.orderDate}</td>
                  <td><span className={getStatusClass(order.status)}>{order.status}</span></td>
                  <td>
                    {order.status === 'PENDING' && (
                      <div className="btn-group">
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingOrder(order)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(order.id)}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  )
}

export default OrderHistory
