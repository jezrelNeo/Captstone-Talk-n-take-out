// components/Navbar.js
function Navbar() {
  return (
    <nav className="navbar-sticky p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Skyhawk Resto Bar</h1>
        <div className="space-x-2">
          <a href="/ordering2/admin/order.html" className="btn-secondary">Order</a>
          <a href="/ordering2/admin/cart.html" className="btn-secondary">Cart</a>
          <a href="/ordering2/admin/products.html" className="btn-secondary">Products</a>
          <a href="/ordering2/admin/dashboard.html" className="btn-primary">Dashboard</a>
        </div>
      </div>
    </nav>
  );
}
