const SalesDataService = {
  async getDashboardStats() {
    try {
      const response = await fetch("api/dashboard_data.php");
      return await response.json();
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return {
        stats: {
          todaySales: 0,
          monthlySales: 0,
          yearlySales: 0,
          todayCoffee: 0,
          todayBread: 0,
          todayPastry: 0
        },
        chartData: { dailySales: [], categoryData: [] }
      };
    }
  }
};
