// components/ProtectedRoute.js
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = AuthUtils.isAuthenticated();
        setIsAuthenticated(authStatus);
        if (!authStatus && window.location.pathname !== `${AuthUtils.getBaseUrl()}/index.html`) {
          window.location.href = `${AuthUtils.getBaseUrl()}/index.html`;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthenticated(false);
        if (window.location.pathname !== `${AuthUtils.getBaseUrl()}/index.html`) {
          window.location.href = `${AuthUtils.getBaseUrl()}/index.html`;
        }
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-light)]">
        <div className="text-center">
          <div className="icon-loader-2 animate-spin text-4xl text-[var(--primary-color)] mb-4"></div>
          <p className="text-[var(--text-light)]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
}

window.ProtectedRoute = ProtectedRoute;