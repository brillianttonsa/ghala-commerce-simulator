import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import MerchantSettings from "../MerchantSettings";
import OrderList from "../OrderList";

function Main({ activeTab, setShowOrderForm, merchants, orders, handleMerchantSaved, handlePaymentConfirmation }) {

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AnimatePresence mode="wait">
                {activeTab === "orders" && (
                    <motion.div
                        key="orders"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
                        <button
                        onClick={() => setShowOrderForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                        >
                        <Plus size={20} />
                        <span>New Order</span>
                        </button>
                    </div>
                    <OrderList orders={orders} onPaymentConfirmation={handlePaymentConfirmation} />
                    </motion.div>
                )}

                {activeTab === "merchants" && (
                    <motion.div
                        key="merchants"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Merchant Settings</h2>
                    <MerchantSettings merchants={merchants} onMerchantSaved={handleMerchantSaved} />
                    </motion.div>
                )}
            </AnimatePresence>

            
        </main>
    )
}

export default Main