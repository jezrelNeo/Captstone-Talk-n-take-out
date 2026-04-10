// components/MenuCard.js - Enhanced with modern design
function MenuCard({ item, onAddToCart }) {
  const [quantity, setQuantity] = React.useState(1);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleAdd = () => {
    if (quantity >= 1) {
      onAddToCart(item, quantity);
      setQuantity(1);
    }
  };

  return (
    <div
      className="card fade-in group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={item.image || 'admin/product_images/default.jpg'}
          alt={item.name}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
          onError={e => e.target.src = 'admin/product_images/default.jpg'}
        />

        {/* Product Code Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm bg-opacity-90">
          {item.code}
        </div>

        {/* Availability Overlay */}
        {!item.is_available && (
          <div className="absolute inset-0 bg-gradient-to-t from-red-600/90 to-red-500/80 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <div className="text-white text-2xl mb-2">🚫</div>
              <span className="text-white font-bold text-lg">Not Available</span>
            </div>
          </div>
        )}


      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
            {item.name}
          </h3>
          {item.description && (
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-blue-600">
              ₱{item.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              per item
            </span>
          </div>

          {item.is_available ? (
            <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-white text-gray-700 font-bold hover:bg-blue-50 hover:text-blue-600 shadow-sm transition-all duration-200 flex items-center justify-center"
              >
                −
              </button>
              <span className="w-10 text-center font-bold text-lg text-gray-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-white text-gray-700 font-bold hover:bg-blue-50 hover:text-blue-600 shadow-sm transition-all duration-200 flex items-center justify-center"
              >
                +
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-500">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Unavailable</span>
            </div>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={!item.is_available}
          className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
            item.is_available
              ? 'btn-primary hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {item.is_available ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M9 21h6m-6 0a2 2 0 11-4 0m6 0a2 2 0 114 0" />
              </svg>
              Add {quantity > 1 ? `${quantity} items` : 'to Cart'}
            </span>
          ) : (
            'Not Available'
          )}
        </button>
      </div>
    </div>
  );
}
