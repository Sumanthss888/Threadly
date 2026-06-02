import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchAllOrders = async () => {
    if (!token) return;
    setIsLoading(true)
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status', { orderId, status: event.target.value }, { headers: { token } })
      if (response.data.success) {
        toast.success("Order status updated successfully")
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to update status")
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div className="bg-white/70 backdrop-blur-md border border-apple-border/40 p-8 rounded-[2rem] shadow-apple-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-apple-text">Manage Orders</h2>
          <p className="text-xs text-apple-textMuted mt-1">Review customer transactions, shipping addresses, and status updates.</p>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-apple-background border border-apple-border/40 rounded-full text-apple-text">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-6 h-6 border-2 border-threadly-gold/20 border-t-threadly-gold rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-apple-border rounded-xl">
          <p className="text-sm text-apple-textMuted">No orders placed yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <div
              key={order._id || index}
              className="grid grid-cols-1 lg:grid-cols-[auto_1fr_1.2fr_0.8fr_1fr] gap-6 items-start border border-apple-border/40 p-6 rounded-2xl bg-white hover:shadow-apple-sm transition-all"
            >
              {/* Package Icon Indicator */}
              <div className="p-3 bg-threadly-gold/5 rounded-xl border border-threadly-gold/15 text-threadly-gold hidden sm:block">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-apple-textMuted uppercase tracking-wider">Purchased Items</p>
                <div className="space-y-1">
                  {order.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="text-sm text-apple-text font-medium">
                      {item.name} <span className="text-apple-textMuted text-xs">x{item.quantity}</span>{' '}
                      <span className="inline-block px-1.5 py-0.2 bg-apple-background text-[10px] rounded border border-apple-border/30 text-apple-textMuted ml-1">
                        {item.size}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address details */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-apple-textMuted uppercase tracking-wider">Shipping Address</p>
                <div className="text-sm text-apple-text font-medium">
                  {order.address.firstName} {order.address.lastName}
                </div>
                <div className="text-xs text-apple-textMuted space-y-0.5 leading-relaxed">
                  <p>{order.address.street}</p>
                  <p>{order.address.city}, {order.address.state}, {order.address.zipcode}</p>
                  <p>{order.address.country}</p>
                  <p className="text-[11px] font-semibold text-apple-text mt-1">{order.address.phone}</p>
                </div>
              </div>

              {/* Payment & Metadata info */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-apple-textMuted uppercase tracking-wider">Transaction Info</p>
                <div className="text-xs text-apple-textMuted space-y-1">
                  <p>Method: <span className="font-semibold text-apple-text">{order.paymentMethod}</span></p>
                  <p>Payment:{' '}
                    <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                      order.payment ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                    }`}>
                      {order.payment ? 'Done' : 'Pending'}
                    </span>
                  </p>
                  <p>Date: <span className="font-medium text-apple-text">{new Date(order.date).toLocaleDateString()}</span></p>
                  <div className="pt-2 text-base font-bold text-apple-text">
                    {currency}{order.amount}
                  </div>
                </div>
              </div>

              {/* Status Select */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-apple-textMuted uppercase tracking-wider">Shipment Status</p>
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                  className="w-full px-3 py-2 rounded-xl border border-apple-border text-xs font-semibold text-apple-text bg-white"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders