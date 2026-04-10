const ExportUtils = {
  exportToCSV: (data, filename) => {
    try {
      if (!data || data.length === 0) {
        alert('No data to export');
        return;
      }

      // Convert data to CSV format
      const headers = ['Order ID', 'Date', 'Customer', 'Items', 'Subtotal', 'Tax', 'Total'];
      const csvContent = [
        headers.join(','),
        ...data.map(order => {
          let items = [];
          try {
            const itemsData = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
            items = itemsData.map(item => `${item.name || 'Unknown'} (${item.quantity || 0})`);
          } catch (e) {
            items = ['Invalid item data'];
          }
          
          return [
            order.order_id || 'N/A',
            new Date(order.timestamp || new Date()).toLocaleDateString(),
            order.username || 'Unknown',
            `"${items.join('; ')}"`,
            parseFloat(order.subtotal || 0).toFixed(2),
            parseFloat(order.tax || 0).toFixed(2),
            parseFloat(order.total || 0).toFixed(2)
          ].join(',');
        })
      ].join('\n');

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export CSV file');
    }
  },

  calculateSummary: (orders) => {
    try {
      if (!orders || orders.length === 0) {
        return {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          itemsSold: { coffee: 0, bread: 0, pastry: 0 }
        };
      }

      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
      const averageOrderValue = totalRevenue / totalOrders;

      const itemsSold = { coffee: 0, bread: 0, pastry: 0 };
      orders.forEach(order => {
        try {
          const itemsData = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
          itemsData.forEach(item => {
            if (item && item.category && itemsSold.hasOwnProperty(item.category)) {
              itemsSold[item.category] += item.quantity || 0;
            }
          });
        } catch (e) {
          console.warn('Invalid items data for order:', order.order_id || 'unknown');
        }
      });

      return {
        totalOrders,
        totalRevenue,
        averageOrderValue,
        itemsSold
      };
    } catch (error) {
      console.error('Error calculating summary:', error);
      return {
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        itemsSold: { coffee: 0, bread: 0, pastry: 0 }
      };
    }
  }
};