// products-app.js
class ErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentCatch(e) { console.error(e); }
  render() {
    if (this.state.hasError) return <div class="text-center py-20"><h1 class="text-red-500 text-3xl">Error loading products</h1></div>;
    return this.props.children;
  }
}

function ProductsAdmin() {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    price: '',
    description: '',
    image: '',
    category: 'shortorder',
    is_available: 1
  });

  const categories = [
    { value: 'shortorder', label: 'Short Order' },
    { value: 'drinks', label: 'Drinks' },
    { value: 'beer', label: 'Beer' },
    { value: 'pork', label: 'Pork' },
    { value: 'mixes', label: 'Mixes' },
    { value: 'pulutan', label: 'Pulutan' },
  ];

  const loadProducts = async () => {
    const res = await fetch('get_products.php');
    const data = await res.json();
    setProducts(data.success ? data.products : []);
    setLoading(false);
  };

  useEffect(() => {
    if (!AuthService.isAuthenticated()) window.location = '../index.html';
    loadProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const url = editItem ? 'update_product.php' : 'add_product.php';
    const method = 'POST';

    const res = await fetch(url, { method, body: new FormData(e.target) });
    const data = await res.json();
    if (data.success) {
      showToast(data.message || "Saved!");
      setShowModal(false);
      loadProducts();
      setEditItem(null);
      e.target.reset();
      setFormData({ name: '', code: '', price: '', description: '', image: '', category: 'coffee', is_available: 1 });
    } else {
      alert(data.message || 'Error');
    }
  };

  const handleEdit = (p) => {
    setEditItem(p.id);
    setFormData(p);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch('delete_product.php?id=' + id);
    const data = await res.json();
    if (data.success) loadProducts();
    else alert('Error');
  };
  };

  const toggleAvailable = async (id, available) => {
    const res = await fetch('toggle_product.php', { method: 'POST', body: new FormData({ id, available: available ? 0 : 1 }) });
    const data = await res.json();
    if (data.success) loadProducts();
  };

  return (
    <div class="min-h-screen bg-[var(--bg-color)]">
      <Header current="products" />

      <div class="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Manage Products</h1>

        <button onClick={() => setShowModal(true)} className="bg-[var(--primary-color)] text-white px-6 py-3 rounded-xl mb-6">
          + Add New Product
        </button>

        {loading ? (
          <p className="p-10 text-center">Loading...</p>
        ) : (
          <table class="w-full bg-white rounded-xl shadow overflow-hidden">
            <thead class="bg-gray-100">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Code</th>
                <th>Price</th>
                <th>Description</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td class="p-4"><img src={p.image || 'https://via.placeholder.com/60'} alt={p.name} class="w-16 h-16 object-cover rounded" /></td>
                  <td className="font-bold">{p.name}</td>
                  <td className="font-mono text-sm">{p.code}</td>
                  <td>₱{Number(p.price).toFixed(2)}</td>
                  <td className="max-w-xs truncate max-w-xs">{p.description || '-'}</td>
                  <td className="capitalize">{p.category}</td>
                  <td>
                    <span className={`px-3 py-1 rounded-full text-sm ${p.is_available == 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {p.is_available == 1 ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="flex gap-2">
                    <button onClick={() => handleEdit(p)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
                    <button onClick={() => toggleAvailable(p.id, p.is_available)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                      {p.is_available == 1 ? 'Disable' : 'Enable'}
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">{editItem ? 'Edit' : 'Add New'} Product</h2>
              <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                <input type="text" name="code" placeholder="Code" value={formData.code} required />
                <input type="number" name="price" placeholder="Price" step="0.01" value={formData.price} required />
                <textarea name="description" placeholder="Description" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                <input type="url" name="image" placeholder="Image URL" value={formData.image} />
                <select name="category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  {categories.map(c => (
                    <option value={c.value}>{c.label}</option>
                  ))}
                </select>
                <div class="flex gap-4 mt-6">
                  <button type="submit" className="bg-green-600 text-white px-6 py-3 rounded-xl">Save</button>
                  <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );


root.render(<ErrorBoundary><ProductsAdmin /></ErrorBoundary>);