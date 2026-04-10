// orders-app.js - CLEAN VERSION WITHOUT TEST BUTTONS
function OrdersApp() {
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showConfirm, setShowConfirm] = React.useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(null);
  const [viewMode, setViewMode] = React.useState('grid'); // 'grid', 'list', or 'history'
  const [orderHistory, setOrderHistory] = React.useState([]);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [historySearchQuery, setHistorySearchQuery] = React.useState('');
  const [showHistorySuggestions, setShowHistorySuggestions] = React.useState(false);
  const [isHistoryFetching, setIsHistoryFetching] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  // Function to calculate and format time elapsed
  const getTimeElapsed = (timestamp) => {
    const now = currentTime;
    const orderTime = new Date(timestamp);
    const diffMs = now - orderTime;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return diffSeconds <= 1 ? 'Just now' : `${diffSeconds} seconds ago`;
    } else if (diffMinutes < 60) {
      return diffMinutes === 1 ? '1 minute ago' : `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      const remainingMinutes = diffMinutes % 60;
      if (remainingMinutes === 0) {
        return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
      } else {
        return diffHours === 1
          ? `1 hour ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} ago`
          : `${diffHours} hours ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''} ago`;
      }
    } else {
      return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
    }
  };

  // Initialize Lucide icons
  const initializeIcons = () => {
    setTimeout(() => {
      if (window.lucide) {
        lucide.createIcons();
      }
    }, 200);
  };

  // Complete REAL database order with ACTUAL value
  const completeRealOrder = (orderId, orderTotal, orderItems) => {
    console.log(`💫 Completing REAL order ${orderId} with value: ₱${orderTotal}`);
    
    if (typeof OrderManager !== 'undefined') {
      const completedOrder = OrderManager.markOrderCompleted(orderId, orderTotal, orderItems);
      if (completedOrder) {
        console.log(`✅ REAL Order ${orderId} recorded: ₱${orderTotal}`);
        return true;
      }
    }
    
    console.log("⚠️ OrderManager not available");
    return false;
  };

  React.useEffect(() => {
    if (!AuthService?.isAuthenticated?.()) {
      window.location.href = "index.html";
      return;
    }

    initializeIcons();
    fetchPendingOrders();
    const interval = setInterval(fetchPendingOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // Load order history when switching to history view
  React.useEffect(() => {
    if (viewMode === 'history') {
      fetchOrderHistory();
    }
  }, [viewMode]);

  // Re-initialize icons when view mode changes
  React.useEffect(() => {
    if (window.lucide) {
      lucide.createIcons();
    }
  }, [viewMode]);

  // Update current time every second for real-time elapsed time display
  React.useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timeInterval);
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const res = await fetch('api/get_pending_orders.php');
      const data = await res.json();
      console.log("📦 Loaded pending orders:", data.orders?.length || 0);
      setOrders(data.success ? data.orders : []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    // Prevent concurrent fetches
    if (isHistoryFetching) {
      console.log("⚠️ History fetch already in progress, skipping...");
      return;
    }

    try {
      setIsHistoryFetching(true);
      setHistoryLoading(true);
      console.log("🔄 Fetching order history...");

      // Clear any existing data to prevent stale state
      setOrderHistory([]);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const res = await fetch('api/get_order_history.php', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("📚 Loaded order history:", data.orders?.length || 0, data);
      console.log("📋 Order history data:", data.orders);

      const orders = data.success ? data.orders : [];
      setOrderHistory(orders);
      console.log("✅ Set orderHistory to:", orders.length, "orders");
    } catch (err) {
      console.error("❌ Failed to load order history:", err);
      setOrderHistory([]);
    } finally {
      setHistoryLoading(false);
      setIsHistoryFetching(false);
    }
  };

  const markAsDone = async () => {
    if (!showConfirm) return;

    try {
      // Find the order details before marking as done
      const orderToComplete = orders.find(o => o.id === showConfirm.id);
      if (!orderToComplete) {
        alert("Order not found!");
        return;
      }

      const orderTotal = parseFloat(orderToComplete.total) || 0;
      const orderItems = typeof orderToComplete.items === 'string'
        ? JSON.parse(orderToComplete.items)
        : orderToComplete.items;

      console.log(`🎯 Completing order ${showConfirm.id} with total: ₱${orderTotal}`, orderItems);

      const res = await fetch('api/mark_order_done.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: showConfirm.id })
      });
      const result = await res.json();

      if (result.success) {
        console.log(`✅ DATABASE ORDER ${showConfirm.id} COMPLETED SUCCESSFULLY`);
        setOrders(prev => prev.filter(o => o.id !== showConfirm.id));
        setShowConfirm(null);

        // Complete with ACTUAL value from database
        const success = completeRealOrder(showConfirm.id, orderTotal, orderItems);

        // Trigger dashboard and header refresh by setting localStorage event
        localStorage.setItem('orderCompleted', Date.now().toString());
        localStorage.setItem('ordersUpdated', Date.now().toString());

        // Always refresh history data after completing an order
        fetchOrderHistory();

      } else {
        alert("Failed to complete order");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const cancelOrder = async () => {
    if (!showCancelConfirm) return;

    try {
      console.log(`🗑️ Canceling order ${showCancelConfirm.id}`);

      const res = await fetch('api/delete_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: showCancelConfirm.id })
      });
      const result = await res.json();

      if (result.success) {
        console.log(`✅ ORDER ${showCancelConfirm.id} CANCELED AND REMOVED`);
        setOrders(prev => prev.filter(o => o.id !== showCancelConfirm.id));
        setShowCancelConfirm(null);

        // Trigger header refresh by setting localStorage event
        localStorage.setItem('ordersUpdated', Date.now().toString());

      } else {
        alert("Failed to cancel order");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  // Filter history orders based on search query
  const filteredHistoryOrders = orderHistory.filter(order =>
    order.order_id.toLowerCase().includes(historySearchQuery.toLowerCase())
  );

  // Get history search suggestions
  const historySearchSuggestions = historySearchQuery.length > 0
    ? orderHistory
        .filter(order =>
          order.order_id.toLowerCase().includes(historySearchQuery.toLowerCase())
        )
        .slice(0, 5) // Limit to 5 suggestions
    : [];

  return (
    <div className="min-h-screen bg-[var(--bg-color)]">
      <Header currentPage="orders" />

      <main key={`main-${viewMode}`} className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-4xl font-bold text-[var(--text-dark)] mb-8 text-center">Pending Orders</h2>

        {/* View Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold text-gray-700">View:</span>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  viewMode === 'grid'
                    ? 'bg-white text-[var(--primary-color)] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <i data-lucide="grid" className="w-4 h-4"></i>
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  viewMode === 'list'
                    ? 'bg-white text-[var(--primary-color)] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <i data-lucide="list" className="w-4 h-4"></i>
                List
              </button>
              <button
                onClick={() => {
                  setViewMode('history');
                  fetchOrderHistory();
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  viewMode === 'history'
                    ? 'bg-white text-[var(--primary-color)] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <i data-lucide="history" className="w-4 h-4"></i>
                History
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-[var(--primary-color)] mx-auto"></div>
            <p className="mt-6 text-xl text-gray-600">Loading orders...</p>
          </div>
        ) : viewMode === 'history' ? (
          <div key="history-view" className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Order History (Last 2 Days)</h3>
                <span className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full">
                  Auto-clears after 2 days
                </span>
              </div>

              {/* Search Bar for History */}
              <div className="relative max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by order ID..."
                    value={historySearchQuery}
                    onChange={(e) => {
                      setHistorySearchQuery(e.target.value);
                      setShowHistorySuggestions(e.target.value.length > 0);
                    }}
                    onFocus={() => setShowHistorySuggestions(historySearchQuery.length > 0)}
                    onBlur={() => setTimeout(() => setShowHistorySuggestions(false), 200)}
                    className="w-full px-6 py-4 pr-12 text-lg border-2 border-gray-300 rounded-2xl focus:border-[var(--primary-color)] focus:outline-none transition-colors duration-200 bg-white shadow-lg"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Search Suggestions Dropdown */}
                {showHistorySuggestions && historySearchSuggestions.length > 0 && (
                  <div key="search-suggestions" className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto">
                    {historySearchSuggestions.map((order, index) => (
                      <div
                        key={`suggestion-${order.id}-${index}`}
                        className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => {
                          setHistorySearchQuery(order.order_id);
                          setShowHistorySuggestions(false);
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-grow">
                            <div className="font-semibold text-gray-900">#{order.order_id}</div>
                            <div className="text-sm text-gray-600">
                              {order.order_type} • ₱{parseFloat(order.total).toFixed(2)} • {new Date(order.timestamp).toLocaleString('en-PH')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {historySearchQuery && (
                <div className="mt-4 text-lg text-gray-600">
                  Found {filteredHistoryOrders.length} order{filteredHistoryOrders.length !== 1 ? 's' : ''} matching "{historySearchQuery}"
                </div>
              )}
            </div>
            {historyLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--primary-color)] mx-auto"></div>
                <p className="mt-4 text-lg text-gray-600">Loading order history...</p>
              </div>
            ) : orderHistory.length === 0 ? (
              <div className="text-center py-20">
                <i data-lucide="history" className="w-24 h-24 text-gray-400 mb-6 mx-auto"></i>
                <h3 className="text-2xl font-bold text-gray-600">No order history</h3>
                <p className="text-lg text-gray-500 mt-4">Completed orders from the last 2 days will appear here</p>
              </div>
            ) : filteredHistoryOrders.length === 0 && historySearchQuery ? (
              <div className="text-center py-20">
                <i data-lucide="search" className="w-24 h-24 text-gray-400 mb-6 mx-auto"></i>
                <h3 className="text-2xl font-bold text-gray-600">No Orders Found</h3>
                <p className="text-lg text-gray-500 mt-4">No orders match your search for "{historySearchQuery}"</p>
                <button
                  onClick={() => setHistorySearchQuery('')}
                  className="mt-4 px-6 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredHistoryOrders.map(order => (
                  <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-lg font-bold text-[var(--primary-color)]">#{order.order_id}</span>
                        <span className={`ml-3 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.order_type === 'Dine In'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {order.order_type}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ₱{parseFloat(order.total || 0).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(order.timestamp).toLocaleString('en-PH')}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between">
                            <span className="font-medium">{item.name} × {item.quantity}</span>
                            <span>₱{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <i data-lucide="check-circle-2" className="w-24 h-24 text-green-500 mb-6 mx-auto"></i>
            <h3 className="text-3xl font-bold text-[var(--text-dark)]">No Pending Orders!</h3>
            <p className="text-xl text-gray-600 mt-4">All orders have been served. Great job!</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {orders.map(order => (
              <div key={order.id} className="card border-l-8 border-l-[var(--accent-color)]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--primary-color)]">#{order.order_id}</h3>
                    <p className="text-lg font-semibold text-orange-600">
                      {getTimeElapsed(order.timestamp)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.timestamp).toLocaleString('en-PH')}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    order.order_type === 'Dine In'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {order.order_type}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-56 overflow-y-auto text-sm">
                  {JSON.parse(order.items).map((item, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                      <span className="font-medium">{item.name} × {item.quantity}</span>
                      <span>₱{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="text-right space-y-2 font-bold text-lg">
                  <div className="text-3xl text-[var(--primary-color)] pt-3 border-t-4 border-double border-gray-400">
                    TOTAL: ₱{parseFloat(order.total || 0).toFixed(2)}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowConfirm({
                      id: order.id,
                      orderId: order.order_id,
                      total: parseFloat(order.total || 0)
                    })}
                    className="btn-green flex-1 text-lg"
                  >
                    Order Done - ₱{parseFloat(order.total || 0).toFixed(2)}
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm({
                      id: order.id,
                      orderId: order.order_id
                    })}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-bold text-lg transition-all shadow-lg flex-1"
                  >
                    Order Canceled
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                <div className="col-span-2">Order #</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-3">Time</div>
                <div className="col-span-3">Items</div>
                <div className="col-span-1">Total</div>
                <div className="col-span-1">Action</div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {orders.map(order => (
                <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-2">
                      <span className="text-lg font-bold text-[var(--primary-color)]">#{order.order_id}</span>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.order_type === 'Dine In'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {order.order_type}
                      </span>
                    </div>
                    <div className="col-span-3">
                      <div className="text-sm">
                        <div className="font-semibold text-orange-600">
                          {getTimeElapsed(order.timestamp)}
                        </div>
                        <div className="text-gray-500">
                          {new Date(order.timestamp).toLocaleString('en-PH')}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="max-h-20 overflow-y-auto text-sm">
                        {JSON.parse(order.items).map((item, i) => (
                          <div key={i} className="truncate">
                            {item.name} × {item.quantity}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <span className="font-bold text-[var(--primary-color)]">
                        ₱{parseFloat(order.total || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setShowConfirm({
                            id: order.id,
                            orderId: order.order_id,
                            total: parseFloat(order.total || 0)
                          })}
                          className="bg-green-600 text-white px-2 py-1 rounded font-bold hover:bg-green-700 transition text-xs flex-1"
                        >
                          Done
                        </button>
                        <button
                          onClick={() => setShowCancelConfirm({
                            id: order.id,
                            orderId: order.order_id
                          })}
                          className="bg-red-600 text-white px-2 py-1 rounded font-bold hover:bg-red-700 transition text-xs flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* CONFIRMATION MODAL - Shows actual amount */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-3xl max-w-lg w-full p-10 text-center">
            <i data-lucide="alert-triangle" className="w-20 h-20 text-yellow-500 mb-6 mx-auto"></i>
            <h3 className="text-3xl font-bold text-[var(--text-dark)] mb-6">Confirm Order Completion</h3>
            <p className="text-xl text-gray-700 mb-4">
              Has <strong className="text-[var(--primary-color)]">Order #{showConfirm.orderId}</strong> been served?
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg mb-6">
              <p className="text-2xl font-bold text-green-600">
                Amount: ₱{showConfirm.total.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                This amount will be added to Today's Sales
              </p>
            </div>
            <div className="flex gap-6">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 py-5 bg-gray-300 hover:bg-gray-400 rounded-2xl font-bold text-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={markAsDone}
                className="flex-1 py-5 bg-[var(--success-color)] hover:bg-green-700 text-white rounded-2xl font-bold text-xl transition-all shadow-xl"
              >
                Yes, Done!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION MODAL */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-3xl max-w-lg w-full p-10 text-center">
            <i data-lucide="trash-2" className="w-20 h-20 text-red-500 mb-6 mx-auto"></i>
            <h3 className="text-3xl font-bold text-[var(--text-dark)] mb-6">Confirm Order Cancellation</h3>
            <p className="text-xl text-gray-700 mb-4">
              Are you sure you want to cancel <strong className="text-red-600">Order #{showCancelConfirm.orderId}</strong>?
            </p>
            <div className="bg-red-50 p-4 rounded-lg mb-6">
              <p className="text-lg font-semibold text-red-600">
                This action cannot be undone!
              </p>
              <p className="text-sm text-gray-600 mt-1">
                The order will be permanently removed from the system.
              </p>
            </div>
            <div className="flex gap-6">
              <button
                onClick={() => setShowCancelConfirm(null)}
                className="flex-1 py-5 bg-gray-300 hover:bg-gray-400 rounded-2xl font-bold text-xl transition-all"
              >
                Keep Order
              </button>
              <button
                onClick={cancelOrder}
                className="flex-1 py-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold text-xl transition-all shadow-xl"
              >
                Yes, Cancel!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<OrdersApp />);

// Initialize icons after render
setTimeout(() => {
  if (window.lucide) {
    lucide.createIcons();
  }
}, 300);