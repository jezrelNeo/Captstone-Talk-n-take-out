// components/CartModal.js — Enhanced Modern Design Version with Additional Improvements
function CartModal({ isOpen, onClose, cart, setCart, showToast }) {
  const [orderType, setOrderType] = React.useState('Dine In');
  const [isPlacingOrder, setIsPlacingOrder] = React.useState(false);

  // Accurate calculation
  const total = React.useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 0));
    }, 0);
  }, [cart]);

  // Handle keyboard events for accessibility
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const updateQuantity = (code, change) => {
    const updated = cart
      .map(item => item.code === code ? { ...item, quantity: Math.max(1, item.quantity + change) } : item)
      .filter(item => item.quantity > 0);
    setCart(updated);
    localStorage.setItem('skyhawk_cart', JSON.stringify(updated));
  };

  const removeItem = (code) => {
    const updated = cart.filter(i => i.code !== code);
    setCart(updated);
    localStorage.setItem('skyhawk_cart', JSON.stringify(updated));
    showToast('Item removed');
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('skyhawk_cart');
    showToast('Cart cleared');
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      showToast('Cart is empty!');
      return;
    }

    setIsPlacingOrder(true);

    const username = localStorage.getItem('username') || 'guest';

    const orderData = {
      orderId: 'ORD-' + Date.now(),
      username: username,
      items: cart,
      total: parseFloat(total),
      orderType: orderType,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('checkout.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const res = await response.json();

      if (res.success) {
        showToast('Order placed successfully!');
        // Update orderData with the actual order ID from backend
        const receiptData = {
          ...orderData,
          orderId: res.order_id  // Use the shortened order ID from backend
        };
        const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(receiptData))));
        window.location.href = `receipt.html?data=${encoded}`;
        setCart([]);
        localStorage.removeItem('skyhawk_cart');
      } else {
        showToast('Error: ' + (res.error || 'Please try again'));
      }
    } catch (error) {
      console.error('Order placement error:', error);
      showToast('Network error. Please check your connection and try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={handleBackdropClick}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl transform animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Your Order</h2>
              <p className="text-sm text-slate-600">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-800 transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-xl text-slate-600 font-medium mb-4">Your cart is empty</p>
              <p className="text-slate-500">Add some delicious items to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.code} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg hover:border-blue-200 transition-all duration-200 transform hover:scale-[1.02]">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <img
                        src={item.image || 'admin/product_images/default.jpg'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-md"
                        onError={e => e.target.src = 'admin/product_images/default.jpg'}
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xl font-bold text-slate-800 mb-1 truncate">{item.name}</h4>
                      <p className="text-lg text-slate-600 font-medium">₱{parseFloat(item.price || 0).toFixed(2)} each</p>
                      <p className="text-sm text-slate-500">Subtotal: ₱{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-slate-100 rounded-xl p-2">
                        <button
                          onClick={() => updateQuantity(item.code, -1)}
                          className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center font-bold"
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-bold text-lg text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.code, 1)}
                          className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.code)}
                        className="text-red-500 hover:text-red-700 font-semibold px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-200 flex items-center gap-2"
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
          )}
        </div>

        {/* Order Type Selection */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="flex gap-3">
            <button
              onClick={() => setOrderType('Dine In')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all duration-200 transform hover:scale-105 ${
                orderType === 'Dine In'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              🍽️ Dine In
            </button>
            <button
              onClick={() => setOrderType('Take Out')}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold text-base transition-all duration-200 transform hover:scale-105 ${
                orderType === 'Take Out'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              🥡 Take Out
            </button>
          </div>
        </div>

        {/* Order Summary & Actions */}
        <div className="border-t-4 border-dashed border-blue-200 px-6 py-6 bg-gradient-to-r from-blue-50 via-slate-50 to-purple-50 rounded-b-3xl">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-2xl">
              <span className="font-bold text-slate-800">TOTAL:</span>
              <span className="font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-lg">₱{total.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-slate-400 to-slate-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-slate-500 hover:to-slate-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Continue Shopping
            </button>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Cart
              </button>
            )}
            <button
              onClick={placeOrder}
              disabled={isPlacingOrder}
              className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg shadow-lg transform transition-all duration-200 flex items-center justify-center gap-2 ${
                isPlacingOrder
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:scale-105'
              }`}
            >
              {isPlacingOrder ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pay ₱{total}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
