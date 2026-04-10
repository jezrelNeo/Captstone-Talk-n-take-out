function Header({ currentPage }) {
  try {
    const [adminInfo, setAdminInfo] = React.useState(null);
    const [pendingOrdersCount, setPendingOrdersCount] = React.useState(0);

    React.useEffect(() => {
      const info = AuthService.getAdminInfo();
      setAdminInfo(info);

      // Fetch pending orders count initially and every 1 second for immediate updates
      fetchPendingOrdersCount();
      const interval = setInterval(fetchPendingOrdersCount, 1000);

      // Listen for order updates from other pages
      const handleStorageChange = (e) => {
        if (e.key === 'ordersUpdated') {
          fetchPendingOrdersCount();
        }
      };

      window.addEventListener('storage', handleStorageChange);

      // Initialize Lucide icons after component mounts
      setTimeout(() => {
        if (window.lucide) {
          lucide.createIcons();
        }
      }, 100);

      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', handleStorageChange);
      };
    }, []);

    const fetchPendingOrdersCount = async () => {
      try {
        const res = await fetch('api/get_pending_orders.php');
        const data = await res.json();
        if (data.success) {
          setPendingOrdersCount(data.orders?.length || 0);
        }
      } catch (err) {
        console.error("Failed to fetch pending orders count:", err);
      }
    };

    const handleLogout = () => {
      if (confirm('Are you sure you want to logout?')) {
        AuthService.logout();
      }
    };

    const navigationItems = [
      { key: 'dashboard', label: 'Dashboard', href: 'dashboard.html', icon: 'house' },
      { key: 'inventory', label: 'Inventory', href: 'inventory.html', icon: 'archive' },
      { key: 'orders', label: 'Orders', href: 'orders.html', icon: 'utensils-crossed' },
      { key: 'profile', label: 'Profile', href: 'profile.html', icon: 'user' }
    ];

    return (
      <header className="bg-white shadow-sm border-b border-gray-200" data-name="header" data-file="components/Header.js">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="img/Logo2.png"  
                  className="w-full h-full object-cover"
                  alt="Skyhawk Logo"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--text-dark)]">Skyhawk Resto Bar</h1>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map(item => (
                <a
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors relative ${
                    currentPage === item.key
                      ? 'bg-[var(--primary-color)] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <i data-lucide={item.icon} className="w-5 h-5"></i>
                  <span className="font-medium">{item.label}</span>
                  {item.key === 'orders' && currentPage !== 'orders' && pendingOrdersCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                      {pendingOrdersCount > 99 ? '99+' : pendingOrdersCount}
                    </span>
                  )}
                </a>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              {adminInfo && (
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-[var(--text-dark)]">{adminInfo.fullName}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              )}
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <i data-lucide="log-out" className="w-5 h-5"></i>
                <span className="hidden sm:block font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <nav className="flex items-center space-x-1 overflow-x-auto">
              {navigationItems.map(item => (
                <a
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors relative ${
                    currentPage === item.key
                      ? 'bg-[var(--primary-color)] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <i data-lucide={item.icon} className="w-5 h-5"></i>
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.key === 'orders' && currentPage !== 'orders' && pendingOrdersCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-4 flex items-center justify-center px-1">
                      {pendingOrdersCount > 99 ? '99+' : pendingOrdersCount}
                    </span>
                  )}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>
    );
  } catch (error) {
    console.error('Header component error:', error);
    return null;
  }
}