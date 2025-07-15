
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/layout/Header";
import Main from "./components/layout/Main";

import axios from "axios";

import OrderForm from "./components/OrderForm"
// import "./App.css"

function App() {
    const [activeTab, setActiveTab] = useState("orders")
    const [merchants, setMerchants] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [showOrderForm, setShowOrderForm] = useState(false)

    const API_BASE = import.meta.env.VITE_API_BASE
    
    useEffect(() => {
      fetchData()
    }, [])

    const fetchData = async () => {
        try {
          setLoading(true)

          // Fetch merchants and orders concurrently (parallel then after all datas archieved continue)
          const [merchantsRes, ordersRes] = await Promise.all([
            axios.get(`${API_BASE}/merchants`),
            axios.get(`${API_BASE}/orders`),
          ])

          // setting the states with fetched data
          setMerchants(merchantsRes.data)
          setOrders(ordersRes.data)
        } catch (error) {
          console.error("Error fetching data:", error)
        } finally {
          setLoading(false)
        }
      }

    const handleMerchantSaved = () => {
      fetchData()
    }

    const handleOrderCreated = () => {
      fetchData()
      setShowOrderForm(false)
    }

    const handlePaymentConfirmation = async (orderId, status) => {
      try {
          const response = await axios.post(`${API_BASE}/orders/${orderId}/confirm-payment`, {
              status,
          });

          if (response.status === 200) {
              fetchData(); // Refresh orders
          }
      } catch (error) {
          console.error("Error confirming payment:", error);
      }
    }



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <Main
        activeTab={activeTab}
        setShowOrderForm={setShowOrderForm}
        handleMerchantSaved={handleMerchantSaved}
        merchants={merchants}
        orders={orders}
        handlePaymentConfirmation={handlePaymentConfirmation}
      />

      {/* Order Form Modal */}
      <AnimatePresence>
        {showOrderForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowOrderForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <OrderForm
                merchants={merchants}
                onOrderCreated={handleOrderCreated}
                onCancel={() => setShowOrderForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App