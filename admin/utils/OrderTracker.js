// Create this new file: utils/OrderTracker.js
const OrderTracker = {
  // Store completed orders in localStorage
  storageKey: 'completedOrders',
  
  // Initialize with today's hardcoded orders
  getInitialOrders() {
    const today = new Date();
    return [
      {
        id: 9991,
        order_id: "TODAY-001",
        total: 2450.75,
        timestamp: new Date(),
        status: "pending",
        items: [
          { name: "Chopsuey", category: "shortorder", price: 245, quantity: 2 },
          { name: "Sprite 12oz", category: "drinks", price: 35, quantity: 3 }
        ]
      },
      {
        id: 9992,
        order_id: "TODAY-002", 
        total: 1875.50,
        timestamp: new Date(today.getTime() + 2 * 60 * 60 * 1000),
        status: "pending",
        items: [
          { name: "Bam-e", category: "shortorder", price: 225, quantity: 4 },
          { name: "San Miguel Pilsen", category: "beer", price: 95, quantity: 2 }
        ]
      },
      {
        id: 9993,
        order_id: "TODAY-003",
        total: 3240.25,
        timestamp: new Date(today.getTime() + 4 * 60 * 60 * 1000),
        status: "pending",
        items: [
          { name: "Crispy Pata", category: "pork", price: 795, quantity: 2 },
          { name: "Pancit Canton", category: "shortorder", price: 225, quantity: 1 }
        ]
      }
    ];
  },

  // Get all orders (pending + completed)
  getAllOrders() {
    const initialOrders = this.getInitialOrders();
    const completedOrders = this.getCompletedOrders();
    
    // Merge orders - if an order is completed, update its status
    return initialOrders.map(order => {
      const completedOrder = completedOrders.find(co => co.id === order.id);
      if (completedOrder) {
        return { ...order, status: 'completed' };
      }
      return order;
    });
  },

  // Mark an order as completed
  markOrderCompleted(orderId) {
    const completedOrders = this.getCompletedOrders();
    const orderToComplete = this.getInitialOrders().find(order => order.id === orderId);
    
    if (orderToComplete && !completedOrders.find(co => co.id === orderId)) {
      completedOrders.push({
        id: orderId,
        order_id: orderToComplete.order_id,
        completedAt: new Date().toISOString()
      });
      
      localStorage.setItem(this.storageKey, JSON.stringify(completedOrders));
      console.log(`✅ Order ${orderId} marked as completed`);
      
      // Notify dashboard
      window.dispatchEvent(new CustomEvent('orderCompleted', { 
        detail: { orderId, total: orderToComplete.total } 
      }));
    }
  },

  // Get completed orders from localStorage
  getCompletedOrders() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch {
      return [];
    }
  },

  // Clear completed orders (for testing)
  clearCompletedOrders() {
    localStorage.removeItem(this.storageKey);
    console.log("🧹 Cleared completed orders");
  }
};