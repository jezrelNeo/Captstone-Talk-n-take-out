function CartApp() {
  const [cart, setCart] = React.useState([]);
  const [showToast, setShowToast] = React.useState(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('skyhawk_cart');
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('skyhawk_cart');
      }
    }
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('skyhawk_cart', JSON.stringify(newCart));
  };

  const addToCart = (item, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.code === item.code);
      if (existing) {
        existing.quantity += quantity;
        showToastMessage(`Added ${quantity} ${item.name}`);
        return [...prev];
      }
      showToastMessage(`Added ${quantity} ${item.name}`);
      return [...prev, { ...item, quantity }];
    });
  };

  const updateQuantity = (code, change) => {
    setCart(prev => {
      const updated = prev
        .map(item => item.code === code ? { ...item, quantity: item.quantity + change } : item)
        .filter(item => item.quantity > 0);
      saveCart(updated);
      return updated;
    });
  };

  const removeItem = (code) => {
    setCart(prev => {
      const updated = prev.filter(i => i.code !== code);
      saveCart(updated);
      showToastMessage("Item removed");
      return updated;
    });
  };

  const showToastMessage = (msg) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  // THIS IS THE FIX – safe total calculation (never returns NaN or 0)
  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const qty   = parseInt(item.quantity) || 0;
      return sum + (price * qty);
    }, 0);
  };

  const total = calculateTotal();

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const orderData = {
      orderId: "ORD" + Date.now(),
      items: cart,
      subtotal: total,           // ← Now always a real number
      username: "guest",
      orderType: "Dine In"
    };

    try {
      const response = await fetch('checkout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        alert(`Order placed successfully!\nOrder ID: ${result.order_id}`);
        setCart([]);
        localStorage.removeItem('skyhawk_cart');
      } else {
        alert("Error: " + (result.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-extrabold text-center text-slate-800 mb-12 tracking-tight">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-24">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-slate-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-2xl text-slate-600 mb-8 font-medium">Your cart is empty</p>
              <a href="index.html" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Continue Shopping
              </a>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Cart Items */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
              <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">Cart Items</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {cart.map(item => (
                  <div key={item.code} className="p-6 hover:bg-slate-50 transition-colors duration-200">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image || 'admin/product_images/default.jpg'}
                          alt={item.name}
                          className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
                          onError={e => e.target.src = 'admin/product_images/default.jpg'}
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="text-xl font-bold text-slate-800 mb-2 truncate">{item.name}</h3>
                        <p className="text-lg text-slate-600 font-medium">₱{parseFloat(item.price || 0).toFixed(2)}</p>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="flex items-center gap-3 bg-slate-100 rounded-xl p-2">
                          <button
                            onClick={() => updateQuantity(item.code, -1)}
                            className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center font-bold text-lg"
                          >
                            −
                          </button>
                          <span className="text-xl font-bold text-slate-800 w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.code, 1)}
                            className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center font-bold text-lg"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.code)}
                          className="text-red-500 hover:text-red-700 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-200 flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Summary</h2>
                <div className="flex justify-between items-center text-3xl font-bold">
                  <span className="text-slate-700">Total:</span>
                  <span className="text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">₱{total.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="index.html"
                  className="flex-1 bg-gradient-to-r from-slate-400 to-slate-500 text-white py-4 px-6 rounded-xl font-bold text-center hover:from-slate-500 hover:to-slate-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Continue Shopping
                </a>
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Place Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-in slide-in-from-right duration-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showToast}
          </div>
        )}
      </div>
    </div>
  );
}

ReactDOM.render(<CartApp />, document.getElementById('root'));