// utils/OrderManager.js
const OrderManager = {
  storageKey: 'completedOrdersData',
  
  // Store order totals when they're completed
  markOrderCompleted(orderId, orderTotal, orderItems = []) {
    const completedOrders = this.getCompletedOrders();
    
    // Check if order already exists
    if (!completedOrders.find(co => co.id === orderId)) {
      const completedOrder = {
        id: orderId,
        total: parseFloat(orderTotal) || 0,
        completedAt: new Date().toISOString(),
        items: orderItems,
        source: 'database' // Mark as real database order
      };
      
      completedOrders.push(completedOrder);
      localStorage.setItem(this.storageKey, JSON.stringify(completedOrders));
      
      console.log(`✅ Real Order ${orderId} completed with total: ₱${orderTotal}`);
      
      // Calculate new totals
      const newTotals = this.calculateTotals();
      
      // Notify dashboard with ACTUAL values
      this.notifyDashboard(newTotals.todaySales, newTotals.todayOrders);
      
      return completedOrder;
    }
    
    return null;
  },

  // Get completed orders from localStorage
  getCompletedOrders() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch {
      return [];
    }
  },

  // Calculate actual totals based on completed orders (fallback only)
  calculateTotals() {
    const completedOrders = this.getCompletedOrders();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter today's completed orders
    const todayCompletedOrders = completedOrders.filter(order => {
      const orderDate = new Date(order.completedAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const todaySales = todayCompletedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const todayOrders = todayCompletedOrders.length;

    // Calculate monthly and yearly from local data (approximate)
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisYear = new Date(today.getFullYear(), 0, 1);

    const monthlyOrders = completedOrders.filter(order => {
      const orderDate = new Date(order.completedAt);
      return orderDate >= thisMonth;
    });

    const yearlyOrders = completedOrders.filter(order => {
      const orderDate = new Date(order.completedAt);
      return orderDate >= thisYear;
    });

    const monthlySales = monthlyOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const yearlySales = yearlyOrders.reduce((sum, order) => sum + (order.total || 0), 0);

    console.log("💰 LOCAL TOTALS from completed orders:", {
      todaySales,
      todayOrders,
      monthlySales,
      yearlySales,
      completedOrders: todayCompletedOrders.map(o => ({
        id: o.id,
        total: o.total,
        source: o.source || 'test'
      }))
    });

    return {
      todaySales,
      todayOrders,
      monthlySales,
      yearlySales
    };
  },

  // Notify dashboard with actual values
  notifyDashboard(todaySales, todayOrders) {
    // Get current calculated totals for monthly/yearly
    const totals = this.calculateTotals();

    console.log("📊 Notifying dashboard with REAL values:", {
      todaySales,
      todayOrders,
      monthlySales: totals.monthlySales,
      yearlySales: totals.yearlySales
    });

    // Method 1: Direct function call
    if (window.forceUpdateSales) {
      window.forceUpdateSales(todaySales, todayOrders);
    }

    // Method 2: Storage event
    const updateData = {
      todaySales: todaySales,
      monthlySales: totals.monthlySales,
      yearlySales: totals.yearlySales,
      todayOrders: todayOrders,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('dashboardUpdate', JSON.stringify(updateData));

    // Method 3: Multiple storage events for reliability
    setTimeout(() => {
      localStorage.setItem('dashboardRealUpdate', Date.now().toString());
    }, 100);
  },

  // Clear all completed orders (for testing)
  clearCompletedOrders() {
    localStorage.removeItem(this.storageKey);
    console.log("🧹 Cleared all completed orders");
    this.notifyDashboard(0, 0); // Reset dashboard
  },

  // Get dashboard stats
  getDashboardStats() {
    return this.calculateTotals();
  },

  // Add test orders for demonstration
  addTestOrder(orderId, total) {
    const testOrder = {
      id: orderId,
      total: total,
      completedAt: new Date().toISOString(),
      items: [],
      source: 'test'
    };
    
    const completedOrders = this.getCompletedOrders();
    completedOrders.push(testOrder);
    localStorage.setItem(this.storageKey, JSON.stringify(completedOrders));
    
    console.log(`🧪 Test Order ${orderId} added: ₱${total}`);
    this.notifyDashboard(this.calculateTotals().todaySales, this.calculateTotals().todayOrders);
  }
};