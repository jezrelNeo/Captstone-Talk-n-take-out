class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function LoginApp() {
  try {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const handleLogin = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      // Simple validation
      if (!username || !password) {
        setError('Please enter both username and password');
        setIsLoading(false);
        return;
      }

      try {
        // Simulate login process
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store user session (simple simulation)
        localStorage.setItem('coffeeMasterUser', JSON.stringify({
          username: username,
          loginTime: new Date().toISOString()
        }));

        // Redirect to main page
        window.location.href = 'order.html';
      } catch (error) {
        setError('Login failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-[var(--bg-light)] flex items-center justify-center" data-name="login-app" data-file="login-app.js">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
  <img 
    src="assets/img/Logo.png" 
    alt="CoffeeMaster Logo" 
    className="w-full h-full object-cover"
  />
</div>
         
                <span className="text-1xl font-bold text-[var(--text-primary)]">Patrick Coffee and Pastry Shop</span>
              </div>
              <h1 className="text-xl font-semibold text-[var(--text-primary)]">Welcome Back</h1>
              <p className="text-[var(--text-secondary)] mt-2">Sign in to your account</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="form-input"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    placeholder="Enter your password"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="icon-loader-2 text-lg animate-spin"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <div className="icon-log-in text-lg"></div>
                      Sign In
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
        
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-[var(--text-secondary)]">
                Don't have an account?{' '}
                <a href="signup.html" className="text-[var(--primary-color)] hover:underline font-medium">
                  Create one here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('LoginApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <LoginApp />
  </ErrorBoundary>
);
