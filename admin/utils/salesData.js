const SalesDataService = {
  async getDashboardStats() {
    console.log("🚀 Getting REAL-TIME dashboard stats");
    
    // Get current date info
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    // Get dynamic orders that can change when marked as done
    const dynamicOrders = OrderTracker.getAllOrders();
    
    console.log(`📊 Processing ${dynamicOrders.length} dynamic orders`);

    // Filter orders by date ranges
    const todayOrders = dynamicOrders.filter(o => {
      const orderDate = new Date(o.timestamp);
      const isToday = orderDate >= today;
      if (isToday) {
        console.log(`📆 TODAY: ${o.order_id} - ₱${o.total} - Status: ${o.status}`);
      }
      return isToday;
    });
    
    // Count completed vs pending orders for today
    const completedToday = todayOrders.filter(o => o.status === 'completed').length;
    const pendingToday = todayOrders.filter(o => o.status === 'pending').length;
    
    console.log(`📈 Today: ${completedToday} completed, ${pendingToday} pending`);

    // Calculate totals - only count completed orders in sales
    const todaySales = todayOrders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    
    const monthlySales = 33257.55; // Keep static for now
    const yearlySales = 119556.80; // Keep static for now

    console.log("💰 REAL-TIME TOTALS:", {
      todaySales,
      completedOrders: completedToday,
      pendingOrders: pendingToday
    });

    // Generate chart data
    const dailySales = this.generateDailySalesData(todayOrders, today);

    const result = {
      stats: {
        todaySales,
        monthlySales,
        yearlySales,
        todayOrders: completedToday, // Only show completed orders count
        pendingOrders: pendingToday
      },
      chartData: {
        dailySales,
        categoryData: [
          { category: "Short Order", qty: 45 },
          { category: "Drinks", qty: 28 },
          { category: "Beer", qty: 35 },
          { category: "Pork", qty: 12 }
        ],
        dailyCategorySales: this.generateDailyCategoryData()
      }
    };

    console.log("🎯 FINAL REAL-TIME RESULT:", result);
    return result;
  },

  generateDailySalesData(todayOrders, today) {
    const dailySales = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // For today, use actual completed orders total
      if (i === 0) {
        const completedTodayTotal = todayOrders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + (o.total || 0), 0);
        
        dailySales.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          total: completedTodayTotal || 0
        });
      } else {
        // For previous days, use random data
        dailySales.push({
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          total: Math.floor(Math.random() * 2000) + 500
        });
      }
    }
    return dailySales;
  },

  generateDailyCategoryData() {
    const categories = ["Short Order", "Drinks", "Beer", "Pork"];
    const dailyData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayData = { 
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) 
      };
      
      categories.forEach(category => {
        dayData[category] = Math.floor(Math.random() * 15) + 5;
      });
      
      dailyData.push(dayData);
    }
    
    return dailyData;
  }
};