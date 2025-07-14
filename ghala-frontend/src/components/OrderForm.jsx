import { useState } from "react"
import { ShoppingCart, X } from "lucide-react"
import axios from "axios"

const OrderForm = ({ merchants, onOrderCreated, onCancel }) => {
    const [formData, setFormData] = useState({
        merchant_id: "",
        customer_name: "",
        customer_email: "",
        product_name: "",
        total_amount: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const API_BASE = import.meta.env.VITE_API_BASE;
            const response = await axios.post(`${API_BASE}/orders`, {
            ...formData,
            total_amount: Number.parseFloat(formData.total_amount),
            })

            // Check if the response is successful
            if (response.status === 200 || response.status === 201) {
                // call function to handle order creation newly
                onOrderCreated()
            }
        } catch (error) {
            console.error("Error creating order:", error)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Create New Order</h3>
        </div>
        <button onClick={onCancel} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Merchant</label>
          <select
            name="merchant_id"
            value={formData.merchant_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a merchant</option>
            {merchants.map((merchant) => (
              <option key={merchant.id} value={merchant.id}>
                {merchant.name} ({merchant.email})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input
              name="customer_name"
              type="text"
              value={formData.customer_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brilliant Tonsa"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Email</label>
            <input
              name="customer_email"
              type="email"
              value={formData.customer_email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="brillianttonsa@gmail.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
          <input
            name="product_name"
            type="text"
            value={formData.product_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="iPhone 15 Pro"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Total Amount (Tsh)</label>
          <input
            name="total_amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.total_amount}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="150000.00"
            required
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Order"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default OrderForm
