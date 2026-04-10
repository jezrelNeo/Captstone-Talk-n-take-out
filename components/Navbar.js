// components/Navbar.js — FULLY FIXED & GORGEOUS HEADER
function Navbar({ cartCount, onCartClick, isListening, toggleVoice }) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-50/95 backdrop-blur-md text-gray-800 shadow-lg border-b border-yellow-200 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* LEFT: Logo + Name */}
        <a href="index.html" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
          <img
            src="assets/img/Logo2.png"
            alt="Skyhawk Logo"
            className="w-12 h-12 object-cover transition-transform duration-300"
            onError={(e) => e.target.src = 'https://via.placeholder.com/80/1e40af/ffffff?text=SKYHAWK'}
          />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-blue-600 font-serif">Skyhawk Resto Bar</h1>
          </div>
        </a>

        {/* CENTER: Navigation Links */}

        {/* RIGHT: Voice + Cart + Order Now */}
        <div className="flex items-center gap-3">

          {/* Cart Button with Count */}
          <button
            onClick={onCartClick}
            className="relative p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition-all duration-300"
            title="Open Cart"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.531 1.64.156 2.087L16 21"/>
              <circle cx="9" cy="20" r="2"/>
              <circle cx="18" cy="20" r="2"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Order Now Button */}

        </div>
      </div>
    </header>
  );
}
