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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i data-lucide="alert-triangle" className="w-8 h-8 text-red-600"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
            <p className="text-gray-600 mb-6">We're sorry, but something unexpected happened.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function ProfileApp() {
  try {
    const [adminInfo, setAdminInfo] = React.useState(null);
    const [formData, setFormData] = React.useState({
      fullName: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [alert, setAlert] = React.useState({ show: false, type: '', message: '' });
    const [validationErrors, setValidationErrors] = React.useState({});

    // Initialize Lucide icons
    const initializeIcons = () => {
      setTimeout(() => {
        if (window.lucide) {
          lucide.createIcons();
        }
      }, 200);
    };

    React.useEffect(() => {
      if (!AuthService.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
      }

      initializeIcons();
      const info = AuthService.getAdminInfo();
      setAdminInfo(info);
      loadAdminData(info.adminId);
    }, []);

    const loadAdminData = async (adminId) => {
      try {
        const admin = await trickleGetObject('admin', adminId);
        setFormData({
          fullName: admin.objectData.full_name || '',
          email: admin.objectData.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    };

    const validateForm = (type) => {
      const errors = {};

      if (type === 'profile') {
        if (!formData.fullName.trim()) {
          errors.fullName = 'Full name is required';
        }
        if (!formData.email.trim()) {
          errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          errors.email = 'Please enter a valid email address';
        }
      } else if (type === 'password') {
        if (!formData.currentPassword) {
          errors.currentPassword = 'Current password is required';
        }
        if (!formData.newPassword) {
          errors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 6) {
          errors.newPassword = 'Password must be at least 6 characters long';
        }
        if (!formData.confirmPassword) {
          errors.confirmPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });

      // Clear validation error for this field when user starts typing
      if (validationErrors[name]) {
        setValidationErrors({ ...validationErrors, [name]: '' });
      }
    };

    const handleUpdateProfile = async (e) => {
      e.preventDefault();

      if (!validateForm('profile')) {
        return;
      }

      setIsLoading(true);

      try {
        const updateData = {
          full_name: formData.fullName,
          email: formData.email
        };

        await trickleUpdateObject('admin', adminInfo.adminId, updateData);

        // Update session info
        const updatedSession = {
          ...adminInfo,
          fullName: formData.fullName
        };
        localStorage.setItem('adminSession', JSON.stringify(updatedSession));
        setAdminInfo(updatedSession);

        setAlert({ show: true, type: 'success', message: 'Profile updated successfully!' });
      } catch (error) {
        setAlert({ show: true, type: 'error', message: 'Failed to update profile. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    };

    const handleChangePassword = async (e) => {
      e.preventDefault();

      if (!validateForm('password')) {
        return;
      }

      setIsLoading(true);

      try {
        // Verify current password
        const adminList = await trickleListObjects('admin');
        const admin = adminList.items.find(a => a.objectId === adminInfo.adminId);

        if (admin.objectData.password !== formData.currentPassword) {
          setValidationErrors({ currentPassword: 'Current password is incorrect' });
          return;
        }

        await trickleUpdateObject('admin', adminInfo.adminId, {
          password: formData.newPassword
        });

        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        setAlert({ show: true, type: 'success', message: 'Password changed successfully!' });
      } catch (error) {
        setAlert({ show: true, type: 'error', message: 'Failed to change password. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    };

    const getInitials = (name) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" data-name="profile-app" data-file="profile-app.js">
        <Header currentPage="profile" />

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Header Section with Avatar */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-white">
                {adminInfo ? getInitials(adminInfo.fullName) : 'A'}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <i data-lucide="check" className="w-4 h-4 text-white"></i>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Profile</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage your account settings, update your information, and secure your profile.
            </p>
          </div>

          {alert.show && (
            <div className="mb-8 flex justify-center">
              <Alert
                type={alert.type}
                message={alert.message}
                onClose={() => setAlert({ show: false, type: '', message: '' })}
              />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <i data-lucide="user" className="w-6 h-6 text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white">Profile Information</h3>
                </div>
                <p className="text-blue-100 mt-2">Update your personal details</p>
              </div>

              <div className="p-6">
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pl-12 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          validationErrors.fullName
                            ? 'border-red-300 focus:ring-red-500 bg-red-50'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder="Enter your full name"
                      />
                      <div className="absolute left-3 top-3.5 w-5 h-5 text-gray-400">
                        <i data-lucide="user" className="w-5 h-5"></i>
                      </div>
                    </div>
                    {validationErrors.fullName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <i data-lucide="alert-circle" className="w-4 h-4"></i>
                        {validationErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pl-12 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          validationErrors.email
                            ? 'border-red-300 focus:ring-red-500 bg-red-50'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        placeholder="Enter your email"
                      />
                      <div className="absolute left-3 top-3.5 w-5 h-5 text-gray-400">
                        <i data-lucide="mail" className="w-5 h-5"></i>
                      </div>
                    </div>
                    {validationErrors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <i data-lucide="alert-circle" className="w-4 h-4"></i>
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i data-lucide="save" className="w-5 h-5"></i>
                        Update Profile
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <i data-lucide="lock" className="w-6 h-6 text-white"></i>
                  </div>
                  <h3 className="text-xl font-bold text-white">Security Settings</h3>
                </div>
                <p className="text-green-100 mt-2">Change your password regularly</p>
              </div>

              <div className="p-6">
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Current Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pl-12 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          validationErrors.currentPassword
                            ? 'border-red-300 focus:ring-red-500 bg-red-50'
                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                        }`}
                        placeholder="Enter current password"
                      />
                      <div className="absolute left-3 top-3.5 w-5 h-5 text-gray-400">
                        <i data-lucide="lock" className="w-5 h-5"></i>
                      </div>
                    </div>
                    {validationErrors.currentPassword && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <i data-lucide="alert-circle" className="w-4 h-4"></i>
                        {validationErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pl-12 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          validationErrors.newPassword
                            ? 'border-red-300 focus:ring-red-500 bg-red-50'
                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                        }`}
                        placeholder="Enter new password"
                      />
                      <div className="absolute left-3 top-3.5 w-5 h-5 text-gray-400">
                        <i data-lucide="key" className="w-5 h-5"></i>
                      </div>
                    </div>
                    {validationErrors.newPassword && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <i data-lucide="alert-circle" className="w-4 h-4"></i>
                        {validationErrors.newPassword}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 pl-12 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                          validationErrors.confirmPassword
                            ? 'border-red-300 focus:ring-red-500 bg-red-50'
                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                        }`}
                        placeholder="Confirm new password"
                      />
                      <div className="absolute left-3 top-3.5 w-5 h-5 text-gray-400">
                        <i data-lucide="check-circle" className="w-5 h-5"></i>
                      </div>
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <i data-lucide="alert-circle" className="w-4 h-4"></i>
                        {validationErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Changing...
                      </>
                    ) : (
                      <>
                        <i data-lucide="key" className="w-5 h-5"></i>
                        Change Password
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-12 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i data-lucide="shield" className="w-8 h-8 text-white"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Security</h3>
              <p className="text-gray-600 mb-6">
                Your account is protected with industry-standard security measures.
                Remember to use strong passwords and change them regularly.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <i data-lucide="lock" className="w-6 h-6 text-blue-600"></i>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Secure Login</h4>
                  <p className="text-sm text-gray-600">Encrypted authentication system</p>
                </div>
                <div className="p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <i data-lucide="eye-off" className="w-6 h-6 text-green-600"></i>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Privacy First</h4>
                  <p className="text-sm text-gray-600">Your data is never shared</p>
                </div>
                <div className="p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <i data-lucide="activity" className="w-6 h-6 text-purple-600"></i>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Activity Monitoring</h4>
                  <p className="text-sm text-gray-600">Track your account activity</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error('ProfileApp component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <ProfileApp />
  </ErrorBoundary>
);

// Initialize icons after render
setTimeout(() => {
  if (window.lucide) {
    lucide.createIcons();
  }
}, 300);