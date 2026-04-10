function ReportSummary({ summary }) {
  try {
    if (!summary) return null;

    return (
      <div className="card mb-8" data-name="report-summary" data-file="components/ReportSummary.js">
        <h3 className="text-lg font-semibold text-[var(--text-dark)] mb-4">Report Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <div className="icon-shopping-cart text-2xl text-blue-600"></div>
            </div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Total Orders</h4>
            <p className="text-2xl font-bold text-[var(--text-dark)]">{summary.totalOrders}</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <div className="icon-dollar-sign text-2xl text-green-600"></div>
            </div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Total Revenue</h4>
            <p className="text-2xl font-bold text-[var(--text-dark)]">₱{summary.totalRevenue.toFixed(2)}</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <div className="icon-trending-up text-2xl text-purple-600"></div>
            </div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Avg Order Value</h4>
            <p className="text-2xl font-bold text-[var(--text-dark)]">₱{summary.averageOrderValue.toFixed(2)}</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-3">
              <div className="icon-package text-2xl text-orange-600"></div>
            </div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Items Sold</h4>
            <p className="text-xl font-bold text-[var(--text-dark)]">
              {summary.itemsSold.coffee + summary.itemsSold.bread + summary.itemsSold.pastry}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-600 mb-3">Items by Category</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-[var(--primary-color)]">{summary.itemsSold.coffee}</p>
              <p className="text-sm text-gray-600">Coffee</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-yellow-600">{summary.itemsSold.bread}</p>
              <p className="text-sm text-gray-600">Bread</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-pink-600">{summary.itemsSold.pastry}</p>
              <p className="text-sm text-gray-600">Pastry</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('ReportSummary component error:', error);
    return null;
  }
}