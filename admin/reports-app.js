class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[var(--text-dark)] mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function ReportsApp() {
  try {
    const [reportData, setReportData] = React.useState([]);
    const [reportSummary, setReportSummary] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [filters, setFilters] = React.useState({
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      reportType: 'daily'
    });

    React.useEffect(() => {
      if (!AuthService.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
      }
      loadReportData();
    }, []);

    const loadReportData = async () => {
      try {
        setIsLoading(true);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        
        const data = await SalesDataService.getReportData(startDate, endDate, filters.reportType);
        setReportData(data.orders);
        setReportSummary(data.summary);
      } catch (error) {
        console.error('Error loading report data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleFilterChange = (e) => {
      setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleGenerateReport = () => {
      loadReportData();
    };

    const handleExportCSV = () => {
      ExportUtils.exportToCSV(reportData, `sales_report_${filters.startDate}_to_${filters.endDate}`);
    };

    const handlePrintReport = () => {
      window.print();
    };

    return (
      <div className="min-h-screen bg-[var(--bg-color)]" data-name="reports-app" data-file="reports-app.js">
        <Header currentPage="reports" />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-2">Sales Reports</h1>
            <p className="text-gray-600">Generate detailed sales reports with export options.</p>
          </div>

          {/* Report Filters */}
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-[var(--text-dark)] mb-4">Report Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  name="reportType"
                  value={filters.reportType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleGenerateReport}
                  className="btn-primary w-full"
                  disabled={isLoading}
                >
                  <div className="icon-bar-chart-3 text-lg"></div>
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* Report Summary */}
          {reportSummary && (
            <ReportSummary summary={reportSummary} />
          )}

          {/* Export Actions */}
          {reportData.length > 0 && (
            <div className="card mb-8">
              <h3 className="text-lg font-semibold text-[var(--text-dark)] mb-4">Export Options</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleExportCSV}
                  className="btn-primary"
                >
                  <div className="icon-download text-lg"></div>
                  Export to CSV
                </button>
                <button
                  onClick={handlePrintReport}
                  className="btn-secondary"
                >
                  <div className="icon-printer text-lg"></div>
                  Print Report
                </button>
              </div>
            </div>
          )}

          {/* Report Table */}
          <div className="card print:shadow-none">
            <h3 className="text-lg font-semibold text-[var(--text-dark)] mb-4">
              Report Details ({filters.startDate} to {filters.endDate})
            </h3>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--primary-color)] border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">Generating report...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="table-header">Order ID</th>
                      <th className="table-header">Date</th>
                      <th className="table-header">Customer</th>
                      <th className="table-header">Items</th>
                      <th className="table-header">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.length > 0 ? (
                      reportData.map((order, index) => (
                        <tr key={index}>
                          <td className="table-cell font-medium">{order.order_id}</td>
                          <td className="table-cell">{new Date(order.timestamp).toLocaleDateString()}</td>
                          <td className="table-cell">{order.username}</td>
                          <td className="table-cell">
                            <div className="max-w-xs truncate">
                              {(() => {
                                try {
                                  const itemsData = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
                                  return itemsData.map(item => item.name || 'Unknown').join(', ');
                                } catch (e) {
                                  return 'Invalid item data';
                                }
                              })()}
                            </div>
                          </td>
                          <td className="table-cell font-medium">${parseFloat(order.total || 0).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="table-cell text-center text-gray-500 py-8">
                          No orders found for the selected date range
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('ReportsApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <ReportsApp />
  </ErrorBoundary>
);