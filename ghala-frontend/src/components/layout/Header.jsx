import { ShoppingCart, Settings } from "lucide-react";

function Header({ activeTab, setActiveTab }) {
  return (
    <header className="bg-white shadow-md border-b-gray-300">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-24">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Ghala Admin</h1>

          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-2 py-2 rounded-lg flex items-center space-x-1 transition-colors ${
                activeTab === "orders"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <ShoppingCart size={20} />
              <span className="sm:text-lg">Orders</span>
            </button>

            <button
              onClick={() => setActiveTab("merchants")}
              className={`px-2 py-2 rounded-lg flex items-center space-x-1 transition-colors ${
                activeTab === "merchants"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Settings size={20} />
              <span className="sm:text-lg">Settings</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
