import { useState } from "react"
import { motion } from "framer-motion"
import { Save, CreditCard, Smartphone, Building, Edit, Plus } from "lucide-react"

const MerchantSettings = ({ merchants, onMerchantSaved }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    payment_method: "mobile",
    payment_config: {},
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const API_BASE = import.meta.env.VITE_API_BASE

  const paymentMethodOptions = [
    { value: "mobile", label: "Mobile Money", icon: Smartphone },
    { value: "card", label: "Card Payment", icon: CreditCard },
    { value: "bank", label: "Bank Transfer", icon: Building },
  ]

  const getPaymentConfigFields = (method) => {
    switch (method) {
      case "mobile":
        return [
          { key: "provider", label: "Provider (e.g., M-Pesa)", type: "text", placeholder: "M-Pesa" },
          { key: "business_number", label: "Business Number", type: "text", placeholder: "174379" },
          { key: "label", label: "Payment Label", type: "text", placeholder: "Store Payments" },
        ]
      case "card":
        return [
          { key: "processor", label: "Payment Processor", type: "text", placeholder: "Stripe" },
          { key: "merchant_id", label: "Merchant ID", type: "text", placeholder: "acct_1234567890" },
          { key: "label", label: "Payment Label", type: "text", placeholder: "Card Payments" },
        ]
      case "bank":
        return [
          { key: "bank_name", label: "Bank Name", type: "text", placeholder: "KCB Bank" },
          { key: "account_number", label: "Account Number", type: "text", placeholder: "1234567890" },
          { key: "branch", label: "Branch", type: "text", placeholder: "Westlands" },
          { key: "label", label: "Payment Label", type: "text", placeholder: "Bank Payments" },
        ]
      default:
        return []
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE}/merchants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setFormData({
          name: "",
          email: "",
          payment_method: "mobile",
          payment_config: {},
        })
        setIsEditing(false)
        onMerchantSaved()
      }
    } catch (error) {
      console.error("Error saving merchant:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (merchant) => {
    setFormData({
      name: merchant.name,
      email: merchant.email,
      payment_method: merchant.payment_method,
      payment_config:
        typeof merchant.payment_config === "string" ? JSON.parse(merchant.payment_config) : merchant.payment_config,
    })
    setIsEditing(true)
  }

  const handleConfigChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      payment_config: {
        ...prev.payment_config,
        [key]: value,
      },
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      payment_method: "mobile",
      payment_config: {},
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-8">
      {/* Merchant Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{isEditing ? "Edit Merchant" : "Add New Merchant"}</h3>
          {isEditing && (
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-700 transition-colors">
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Merchant Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter merchant name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="merchant@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Payment Method</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentMethodOptions.map((option) => {
                const Icon = option.icon
                return (
                  <label
                    key={option.value}
                    className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.payment_method === option.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      value={option.value}
                      checked={formData.payment_method === option.value}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          payment_method: e.target.value,
                          payment_config: {},
                        }))
                      }
                      className="sr-only"
                    />
                    <Icon className="w-6 h-6 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Payment Configuration Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Payment Configuration</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getPaymentConfigFields(formData.payment_method).map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">{field.label}</label>
                  <input
                    type={field.type}
                    value={formData.payment_config[field.key] || ""}
                    onChange={(e) => handleConfigChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Save size={20} />
            <span>{loading ? "Saving..." : isEditing ? "Update Merchant" : "Save Merchant"}</span>
          </button>
        </form>
      </motion.div>

      {/* Existing Merchants */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border"
      >
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Existing Merchants</h3>
        </div>

        <div className="divide-y">
          {merchants.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No merchants configured yet. Add your first merchant above.</p>
            </div>
          ) : (
            merchants.map((merchant) => {
              const paymentConfig =
                typeof merchant.payment_config === "string"
                  ? JSON.parse(merchant.payment_config)
                  : merchant.payment_config

              const PaymentIcon =
                paymentMethodOptions.find((opt) => opt.value === merchant.payment_method)?.icon || CreditCard

              return (
                <motion.div
                  key={merchant.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <PaymentIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{merchant.name}</h4>
                        <p className="text-gray-600">{merchant.email}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {merchant.payment_method} • {paymentConfig.label || "No label"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleEdit(merchant)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Edit size={20} />
                    </button>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default MerchantSettings
