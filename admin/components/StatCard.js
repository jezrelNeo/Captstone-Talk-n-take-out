function StatCard({ title, value, icon, color, bgColor, isUpdated = false }) {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (isUpdated) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isUpdated, value]);

  try {
    return (
      <div 
        className={`stat-card ${bgColor} relative transition-all duration-300 ${
          isAnimating ? 'ring-2 ring-green-400 scale-105' : ''
        }`} 
        data-name="stat-card" 
        data-file="components/StatCard.js"
      >
        {/* Update indicator dot */}
        {isAnimating && (
          <div className="absolute -top-1 -right-1">
            <div className="relative">
              <div className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></div>
              <div className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></div>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-center mb-4">
          <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}>
            <div className={`icon-${icon} text-2xl ${color}`}></div>
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
        <p className={`text-2xl font-bold text-[var(--text-dark)] transition-all duration-500 ${
          isAnimating ? 'text-green-600' : ''
        }`}>
          {value}
        </p>
      </div>
    );
  } catch (error) {
    console.error('StatCard component error:', error);
    return null;
  }
}