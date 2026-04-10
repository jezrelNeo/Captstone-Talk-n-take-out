function Toast({ message, type = 'success' }) {
  try {
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    const getIcon = () => {
      switch (type) {
        case 'success':
          return 'check-circle';
        case 'error':
          return 'x-circle';
        default:
          return 'info';
      }
    };

    const getBorderColor = () => {
      switch (type) {
        case 'success':
          return 'border-[var(--success-color)]';
        case 'error':
          return 'border-[var(--error-color)]';
        default:
          return 'border-blue-500';
      }
    };

    return (
      <div 
        className={`toast ${getBorderColor()}`}
        data-name="toast" 
        data-file="components/Toast.js"
      >
        <div className="flex items-center gap-3">
          <div className={`icon-${getIcon()} text-xl text-[var(--success-color)]`}></div>
          <p className="text-[var(--text-primary)] font-medium">{message}</p>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-auto text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <div className="icon-x text-lg"></div>
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Toast component error:', error);
    return null;
  }
}