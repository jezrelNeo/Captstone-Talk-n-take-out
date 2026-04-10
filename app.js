// app.js ← REPLACE YOUR ENTIRE app.js WITH THIS FIXED VERSION
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <div className="min-h-screen flex items-center justify-center text-3xl">Error! Reload.</div>;
    return this.props.children;
  }
}

function App() {
  const [menuItems, setMenuItems] = React.useState([]);
  const [currentCategory, setCurrentCategory] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showToast, setShowToast] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState('');
  const [cart, setCart] = React.useState([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const saved = localStorage.getItem('skyhawk_cart');
    if (saved) setCart(JSON.parse(saved));
    fetch('api/get_menu.php')
      .then(r => r.json())
      .then(res => { if (res.success) setMenuItems(res.data); })
      .finally(() => setLoading(false));

    // Listen for product updates from admin inventory
    const handleProductUpdate = (event) => {
      if (event.key === 'productUpdated' && event.newValue) {
        console.log('📦 Menu update detected, refreshing menu...');
        fetch('api/get_menu.php')
          .then(r => r.json())
          .then(res => {
            if (res.success) {
              setMenuItems(res.data);
              showToastMessage('Menu updated with latest changes!');
            }
          })
          .catch(err => console.error('Failed to refresh menu:', err));
        // Clear the storage event to prevent repeated triggers
        localStorage.removeItem('productUpdated');
      }
    };

    window.addEventListener('storage', handleProductUpdate);

    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleProductUpdate);
    };
  }, []);

  const addToCart = (item, quantity = 1) => {
    setCart(prevCart => {
      let updated = [...prevCart];
      const existingIndex = updated.findIndex(i => i.code === item.code);
      if (existingIndex !== -1) {
        updated[existingIndex].quantity += quantity;
      } else {
        updated.push({ ...item, quantity });
      }
      localStorage.setItem('skyhawk_cart', JSON.stringify(updated));
      return updated;
    });
    showToastMessage(`Added ${quantity} × ${item.name}`);
  };

  const showToastMessage = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const filteredItems = menuItems.filter(item =>
    (currentCategory === 'all' || item.category === currentCategory) &&
    (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const categories = [
    { id: 'all', name: 'All Items', icon: 'fi fi-rr-table' },
    { id: 'shortorder', name: 'Short Order', icon: 'fi fi-rr-utensils' },
    { id: 'soup', name: 'Soup', icon: 'fi fi-rr-soup' },
    { id: 'seafood', name: 'Seafood', icon: 'fi fi-rr-shrimp' },
    { id: 'appetizers', name: 'Appetizer', icon: 'fi fi-rr-ice-cream' },
    { id: 'chicken', name: 'Chicken', icon: 'fi fi-rr-drumstick' },
    { id: 'sizzling', name: 'Sizzling', icon: 'fi fi-rr-room-service' },
    { id: 'pork', name: 'Pork', icon: 'fi fi-rr-bacon' },
    { id: 'mixes', name: 'Mixes', icon: 'fi fi-rr-cocktail' },
    { id: 'pulutan', name: 'Pulutan', icon: 'fi fi-rr-plate' },
    { id: 'drinks', name: 'Drinks', icon: 'fi fi-rr-glass-champagne' },
    { id: 'beer', name: 'Beers', icon: 'fi fi-rr-beer' },
    { id: 'hard_drinks', name: 'Hard Drinks', icon: 'fi fi-rr-glass-whiskey-rocks' }
  ];

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center slide-up">
        <div className="loading-spinner mb-6"></div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Loading Delicious Menu</h2>
        <p className="text-gray-600">Preparing your culinary experience...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar cartCount={cart.reduce((s, i) => s + i.quantity, 0)} onCartClick={() => setIsCartOpen(true)} />

      <main className="container mx-auto px-6 py-16">
        {/* Search and Voice Command Section */}
        <div className="max-w-4xl mx-auto mb-12 mt-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            <div className="search-container flex-1 max-w-md">
              <div className="relative">
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search delicious items or enter product code..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="flex-shrink-0">
              <VoiceCommand onItemAdded={addToCart} showToast={showToastMessage} />
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-16">
          <h2 className="section-title">Explore Our Categories</h2>
          <p className="section-subtitle">Choose from our wide selection of delicious dishes and beverages</p>

          <div className="flex flex-wrap gap-4 justify-center max-w-6xl mx-auto">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setCurrentCategory(category.id)}
                className={`category-btn ${
                  currentCategory === category.id
                    ? 'category-btn-active'
                    : 'category-btn-inactive'
                }`}
              >
                <i className={`${category.icon} text-xl`}></i>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="section-title">
              {currentCategory === 'all' ? 'Our Complete Menu' : `${categories.find(c => c.id === currentCategory)?.name || 'Menu Items'}`}
            </h2>
            <p className="section-subtitle">
              {filteredItems.length} delicious {filteredItems.length === 1 ? 'item' : 'items'} available
            </p>
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No items found</h3>
              <p className="text-gray-500">Try adjusting your search or browse all categories</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredItems.map((item, index) => (
                <div key={item.code} style={{ animationDelay: `${index * 100}ms` }}>
                  <MenuCard item={item} onAddToCart={addToCart} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} setCart={setCart} showToast={showToastMessage} />
      {showToast && <Toast message={toastMessage} />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><App /></ErrorBoundary>);