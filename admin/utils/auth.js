const AuthService = {
  async login(username, password) {
    try {
      const response = await fetch("api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("adminSession", JSON.stringify({
          adminId: data.admin.id,
          username: data.admin.username,
          fullName: data.admin.fullName,
          role: data.admin.role,
          loginTime: new Date().toISOString()
        }));
        return true;
      } else {
        console.warn("Login failed:", data.message);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  },

  async register(username, password, fullName, role = "admin") {
    try {
      const response = await fetch("api/signup.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, fullName, role })
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Something went wrong" };
    }
  },

  logout() {
    localStorage.removeItem("adminSession");
    window.location.href = "index.html";
  },

  isAuthenticated() {
    return localStorage.getItem("adminSession") !== null;
  },

  getAdminInfo() {
    const session = localStorage.getItem("adminSession");
    return session ? JSON.parse(session) : null;
  },

  validateSession() {
    const session = this.getAdminInfo();
    if (!session) return false;

    const loginTime = new Date(session.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

    if (hoursDiff > 8) {
      this.logout();
      return false;
    }
    return true;
  }
};
