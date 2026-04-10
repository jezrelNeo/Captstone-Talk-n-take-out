function LoginForm({ switchToSignup }) {
  const [formData, setFormData] = React.useState({ username: "", password: "" });
  const [error, setError] = React.useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await AuthService.login(formData.username, formData.password);
    if (success) {
      window.location.href = "dashboard.html";
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="card max-w-md mx-auto mt-24">
      <h1 className="text-2xl font-bold text-center mb-6 text-[var(--text-dark)]">
        Skyhawk Restor Bar Admin
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Sign in to access the management system
      </p>

      {error && <div className="bg-[var(--error-color)] text-white p-2 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          required
        />
        <button type="submit" className="btn-primary w-full">Login</button>
      </form>

      <p className="text-center mt-4 text-sm text-gray-600">
        Don’t have an account?{" "}
        <button onClick={switchToSignup} className="text-[var(--primary-color)] underline">
          Sign up
        </button>
      </p>
    </div>
  );
}

function SignupForm({ switchToLogin }) {
  const [formData, setFormData] = React.useState({ username: "", password: "", fullName: "" });
  const [message, setMessage] = React.useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await AuthService.register(formData.username, formData.password, formData.fullName);
    setMessage(result.message);

    if (result.success) {
      setTimeout(() => {
        switchToLogin();
      }, 1500);
    }
  };

  return (
    <div className="card max-w-md mx-auto mt-24">
      <h1 className="text-2xl font-bold text-center mb-6 text-[var(--text-dark)]">
        Create Account
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="input-field"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          required
        />
        <button type="submit" className="btn-primary w-full">Sign Up</button>
      </form>

      {message && <p className="mt-3 text-center">{message}</p>}

      <p className="text-center mt-4 text-sm text-gray-600">
        Already have an account?{" "}
        <button onClick={switchToLogin} className="text-[var(--primary-color)] underline">
          Login
        </button>
      </p>
    </div>
  );
}

function App() {
  const [isSignup, setIsSignup] = React.useState(false);

  return (
    <div>
      {isSignup ? (
        <SignupForm switchToLogin={() => setIsSignup(false)} />
      ) : (
        <LoginForm switchToSignup={() => setIsSignup(true)} />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
