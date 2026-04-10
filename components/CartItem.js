function CartItem({ item, onUpdateQuantity, onRemove }) {
  const handleQuantityChange = (change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity > 0) {
      onUpdateQuantity(item.code, newQuantity);
    } else {
      // Auto-remove when quantity reaches 0
      if (confirm(`Remove ${item.name} from cart?`)) {
        onRemove(item.code);
      }
    }
  };

  const handleRemove = () => {
    if (confirm(`Remove ${item.name} from cart?`)) {
      onRemove(item.code);
    }
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="card p-4" data-name="cart-item" data-file="components/CartItem.js">
      <div className="flex items-center gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80';
          }}
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">{item.name}</h3>
              <span className="text-sm text-[var(--text-secondary)] bg-[var(--secondary-color)] px-2 py-1 rounded">
                {item.code}
              </span>
            </div>
            <button
              onClick={handleRemove}
              className="text-[var(--error-color)] hover:text-red-700 transition-colors"
            >
              <div className="icon-trash-2 text-lg"></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleQuantityChange(-1)}
                className="w-8 h-8 rounded-full bg-[var(--secondary-color)] flex items-center justify-center hover:bg-opacity-80 transition-colors"
              >
                <div className="icon-minus text-sm"></div>
              </button>
              <span className="font-medium text-[var(--text-primary)] min-w-[2rem] text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-8 h-8 rounded-full bg-[var(--secondary-color)] flex items-center justify-center hover:bg-opacity-80 transition-colors"
              >
                <div className="icon-plus text-sm"></div>
              </button>
            </div>

            <div className="text-right">
              <div className="text-sm text-[var(--text-secondary)]">₱{item.price.toFixed(2)} each</div>
              <div className="font-semibold text-[var(--primary-color)]">₱{subtotal.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}