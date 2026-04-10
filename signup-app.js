class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo.componentStack);
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

function SignupApp() {
  try {
    const [formData, setFormData] = React.useState({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      contactNumber: ""
    });
    const [errors, setErrors] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const handleInputChange = (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    };

    const validateForm = () => {
      const newErrors = {};

      if (!formData.username.trim()) {
        newErrors.username = "Username is required";
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters";
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }

      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      if (!formData.contactNumber.trim()) {
        newErrors.contactNumber = "Contact number is required";
      } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.contactNumber)) {
        newErrors.contactNumber = "Please enter a valid contact number";
      }

      return newErrors;
    };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validateForm();
  
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setIsLoading(true);
  try {
    // ✅ Prepare payload for PHP
    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      contact: formData.contactNumber // PHP expects "contact"
    };

    // send data to backend PHP
    const response = await fetch("signup.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload) // ✅ use payload, not formData
    });

    const result = await response.json();

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } else {
      setErrors({ general: result.message || "Registration failed. Please try again." });
    }
  } catch (error) {
    setErrors({ general: "Server error. Please try again later." });
  } finally {
    setIsLoading(false);
  }
};

    if (success) {
      return (
        <div className="min-h-screen bg-[var(--bg-light)] flex items-center justify-center">
          <div className="max-w-md w-full mx-4 text-center">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="icon-check-circle text-4xl text-[var(--success-color)] mb-4"></div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Account Created!</h1>
              <p className="text-[var(--text-secondary)]">Redirecting to homepage...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[var(--bg-light)] flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-12 h-12 bg-[var(--primary-color)] rounded-lg flex items-center justify-center">
                  <div className="icon-coffee text-2xl text-white"></div>
                </div>
                <span className="text-2xl font-bold text-[var(--text-primary)]">CoffeeMaster</span>
              </div>
              <h1 className="text-xl font-semibold text-[var(--text-primary)]">Create Account</h1>
              <p className="text-[var(--text-secondary)] mt-2">Join us for amazing coffee experience</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium">Username</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={`form-input ${errors.username ? "error-input" : ""}`}
                  />
                  {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`form-input ${errors.email ? "error-input" : ""}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium">Contact Number</label>
                  <input
                    type="tel"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                    className={`form-input ${errors.contactNumber ? "error-input" : ""}`}
                  />
                  {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`form-input ${errors.password ? "error-input" : ""}`}
                  />
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium">Confirm Password</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className={`form-input ${errors.confirmPassword ? "error-input" : ""}`}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {errors.general}
                  </div>
                )}

                <button type="submit" disabled={isLoading} className="w-full btn-primary">
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("SignupApp component error:", error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <SignupApp />
  </ErrorBoundary>
);
