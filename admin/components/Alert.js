function Alert({ type, message, onClose }) {
  try {
    const alertStyles = {
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800'
    };

    const iconStyles = {
      success: 'text-green-500',
      error: 'text-red-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500'
    };

    const icons = {
      success: 'check-circle',
      error: 'x-circle',
      warning: 'alert-triangle',
      info: 'info'
    };

    return (
      <div className={`border rounded-lg p-4 mb-4 flex items-start gap-3 ${alertStyles[type]}`} data-name="alert" data-file="components/Alert.js">
        <div className={`icon-${icons[type]} text-lg ${iconStyles[type]} flex-shrink-0 mt-0.5`}></div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${iconStyles[type]} hover:opacity-70 transition-opacity`}
          >
            <div className="icon-x text-lg"></div>
          </button>
        )}
      </div>
    );
  } catch (error) {
    console.error('Alert component error:', error);
    return null;
  }
}