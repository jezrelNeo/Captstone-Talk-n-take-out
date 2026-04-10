// inventory-app.js

function InventoryApp() {
    const [menuItems, setMenuItems] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [openCategories, setOpenCategories] = React.useState({});
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [showEditModal, setShowEditModal] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState(null);
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [deletingProduct, setDeletingProduct] = React.useState(null);
    const [message, setMessage] = React.useState('');
    const [imageFile, setImageFile] = React.useState(null);
    const [imagePreview, setImagePreview] = React.useState('');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [viewMode, setViewMode] = React.useState('grid'); // 'grid' or 'list'

    const [form, setForm] = React.useState({
        name: '', code: '', price: '', description: '', category: 'shortorder', is_available: true
    });

    const categoryLabels = {
        coffee: "Coffee", beverages: "Beverages", pastries: "Pastries", breads: "Breads",
        shortorder: "Short Order", drinks: "Drinks", beer: "Beer", pork: "Pork",
        chicken: "Chicken", soup: "Soup", seafood: "Seafood", sizzling: "Sizzling",
        appetizers: "Appetizers", hard_drinks: "Hard Drinks", mixes: "Mixes", pulutan: "Pulutan"
    };

    React.useEffect(() => {
        if (!AuthService?.isAuthenticated?.()) {
            window.location.href = "index.html";
            return;
        }
        loadMenuItems();
        
        // Initialize Lucide icons after a short delay to ensure DOM is ready
        setTimeout(() => {
            if (window.lucide) {
                lucide.createIcons();
            }
        }, 200);
    }, []);

    const loadMenuItems = async () => {
        try {
            setLoading(true);
            const res = await fetch('get_products.php');
            const data = await res.json();
            setMenuItems(data.success ? data.products : []);
            const open = {};
            (data.products || []).forEach(p => open[p.category] = true);
            setOpenCategories(open);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setMessage('Adding product...');

        const formData = new FormData();
        formData.append('name', form.name.trim());
        formData.append('code', form.code.trim().toUpperCase());
        formData.append('price', parseFloat(form.price));
        formData.append('description', form.description.trim());
        formData.append('category', form.category);
        formData.append('is_available', form.is_available ? 1 : 0);
        if (imageFile) formData.append('image', imageFile);

        try {
            const res = await fetch('add_product.php', { method: 'POST', body: formData });
            const result = await res.json();

            if (result.success) {
                setMessage('Product added successfully!');
                setTimeout(() => {
                    setShowAddModal(false);
                    setMessage('');
                    setForm({ name: '', code: '', price: '', description: '', category: 'coffee', is_available: true });
                    setImageFile(null);
                    setImagePreview('');
                    loadMenuItems();

                    // Trigger menu refresh across all open tabs/windows
                    localStorage.setItem('productUpdated', Date.now().toString());
                }, 1500);
            } else {
                setMessage('Error: ' + (result.message || 'Upload failed'));
            }
        } catch (err) {
            setMessage('Network error');
        }
    };

    const confirmDelete = (product) => {
        setDeletingProduct(product);
        setShowDeleteModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setForm({
            name: product.name,
            code: product.code,
            price: product.price,
            description: product.description || '',
            category: product.category,
            is_available: product.is_available == 1
        });
        setImageFile(null);
        setImagePreview('');
        setShowEditModal(true);
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();
        console.log('handleEditProduct called with product:', editingProduct);
        console.log('Form data:', form);
        setMessage('Updating product...');

        try {
            const formData = new FormData();
            formData.append('id', editingProduct.id);
            formData.append('name', form.name.trim());
            formData.append('code', form.code.trim().toUpperCase());
            formData.append('price', parseFloat(form.price));
            formData.append('description', form.description.trim());
            formData.append('category', form.category);
            formData.append('is_available', form.is_available ? 1 : 0);
            if (imageFile) formData.append('image', imageFile);

            console.log('FormData created:', formData);
            console.log('Making fetch request to update_product.php');

            const res = await fetch('update_product.php', { method: 'POST', body: formData });
            console.log('Fetch response status:', res.status);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const result = await res.json();
            console.log('Response result:', result);

            if (result.success) {
                setMessage('Product updated successfully!');
                setTimeout(() => {
                    setShowEditModal(false);
                    setEditingProduct(null);
                    setMessage('');
                    setImageFile(null);
                    setImagePreview('');
                    loadMenuItems();

                    // Trigger menu refresh across all open tabs/windows
                    localStorage.setItem('productUpdated', Date.now().toString());
                }, 1500);
            } else {
                setMessage('Error: ' + (result.message || 'Update failed'));
            }
        } catch (err) {
            console.error('Error in handleEditProduct:', err);
            setMessage('Error: ' + err.message);
        }
    };

    const handleDelete = async () => {
        if (!deletingProduct?.id) return;
        await fetch('delete_product.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: deletingProduct.id })
        });
        setShowDeleteModal(false);
        loadMenuItems();

        // Trigger menu refresh across all open tabs/windows
        localStorage.setItem('productUpdated', Date.now().toString());
    };

    // Filter items based on search query
    const filteredItems = menuItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Get search suggestions
    const searchSuggestions = searchQuery.length > 0
        ? menuItems
            .filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.code && item.code.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .slice(0, 5) // Limit to 5 suggestions
        : [];

    const grouped = filteredItems.reduce((acc, item) => {
        const cat = item.category || 'uncategorized';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-[var(--bg-color)]">
            <Header currentPage="inventory" />

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h2 className="text-5xl font-bold text-[var(--text-dark)]">Menu Products</h2>

                    {/* Search Bar */}
                    <div className="relative mt-8 max-w-md">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by product name or menu code..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(e.target.value.length > 0);
                                }}
                                onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                className="w-full px-6 py-4 pr-12 text-lg border-2 border-gray-300 rounded-2xl focus:border-[var(--primary-color)] focus:outline-none transition-colors duration-200 bg-white shadow-lg"
                            />
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Search Suggestions Dropdown */}
                        {showSuggestions && searchSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-64 overflow-y-auto">
                                {searchSuggestions.map((item, index) => (
                                    <div
                                        key={item.id}
                                        className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        onClick={() => {
                                            setSearchQuery(item.name);
                                            setShowSuggestions(false);
                                        }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={`product_images/${item.image || 'default.jpg'}?t=${Date.now()}`}
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded-lg"
                                                onError={e => e.target.src = 'product_images/default.jpg'}
                                            />
                                            <div className="flex-grow">
                                                <div className="font-semibold text-gray-900">{item.name}</div>
                                                <div className="text-sm text-gray-600">
                                                    Code: {item.code} • ₱{parseFloat(item.price).toFixed(2)} • {categoryLabels[item.category] || item.category}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {searchQuery && (
                        <div className="mt-4 text-lg text-gray-600">
                            Found {filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''} matching "{searchQuery}"
                        </div>
                    )}

                    {/* View Mode Toggle */}
                    <div className="mt-6 flex items-center gap-4">
                        <span className="text-lg font-semibold text-gray-700">View:</span>
                        <div className="flex bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                                    viewMode === 'grid'
                                        ? 'bg-white text-[var(--primary-color)] shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <i data-lucide="grid" className="w-4 h-4"></i>
                                Grid
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                                    viewMode === 'list'
                                        ? 'bg-white text-[var(--primary-color)] shadow-sm'
                                        : 'text-gray-600 hover:text-gray-800'
                                }`}
                            >
                                <i data-lucide="list" className="w-4 h-4"></i>
                                List
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-32">
                        <div className="inline-block animate-spin rounded-full h-20 w-20 border-8 border-[var(--primary-color)] border-t-transparent"></div>
                    </div>
                ) : Object.keys(grouped).length === 0 ? (
                    <div className="text-center py-32">
                        <div className="text-6xl mb-6">🔍</div>
                        <p className="text-3xl text-gray-500 mb-4">
                            {searchQuery ? `No products found matching "${searchQuery}"` : 'No products found'}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-xl font-semibold hover:bg-[var(--secondary-color)] transition-colors duration-200"
                            >
                                Clear Search
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.keys(grouped).sort().map(cat => (
                            <div key={cat} className="bg-white rounded-3xl shadow-xl overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white p-6 cursor-pointer flex justify-between items-center"
                                    onClick={() => setOpenCategories(prev => ({...prev, [cat]: !prev[cat]}))}
                                >
                                    <h3 className="text-2xl font-bold">
                                        {categoryLabels[cat] || cat} ({grouped[cat].length})
                                        {searchQuery && <span className="text-sm font-normal ml-2">(filtered)</span>}
                                    </h3>
                                    <i data-lucide={openCategories[cat] ? "chevron-down" : "chevron-right"} className="w-8 h-7"></i>
                                </div>

                                {openCategories[cat] && (
                                    viewMode === 'grid' ? (
                                        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                            {grouped[cat].map(p => (
                                                <div key={p.id} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition relative group/item">
                                                    {/* SUPPORTS ALL IMAGE TYPES: jpg, png, gif, webp, svg, bmp */}
                                                    <div className="relative mb-4">
                                                        <img
                                                            src={`product_images/${p.image || 'default.jpg'}?t=${Date.now()}`}
                                                            alt={p.name}
                                                            className="w-full h-48 object-cover rounded-xl"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'product_images/default.jpg';
                                                            }}
                                                        />
                                                        {p.is_available != 1 && (
                                                            <div className="absolute inset-0 bg-red-600 bg-opacity-80 rounded-xl flex items-center justify-center">
                                                                <span className="text-white font-bold text-xl">Not Available</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h4 className="text-xl font-bold">{p.name}</h4>
                                                    {p.code && <p className="text-gray-600">Code: <strong>{p.code}</strong></p>}
                                                    <p className="text-2xl font-bold text-[var(--primary-color)] mt-2">₱{parseFloat(p.price).toFixed(2)}</p>
                                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/item:opacity-100 transition">
                                                        <button
                                                            onClick={() => openEditModal(p)}
                                                            className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold hover:bg-blue-700 transition text-sm"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => confirmDelete(p)}
                                                            className="btn-danger"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8">
                                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                                    <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                                                        <div className="col-span-1">Image</div>
                                                        <div className="col-span-4">Product Details</div>
                                                        <div className="col-span-2">Code</div>
                                                        <div className="col-span-2">Price</div>
                                                        <div className="col-span-2">Status</div>
                                                        <div className="col-span-1">Actions</div>
                                                    </div>
                                                </div>
                                                <div className="divide-y divide-gray-100">
                                                    {grouped[cat].map(p => (
                                                        <div key={p.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                                                            <div className="grid grid-cols-12 gap-4 items-center">
                                                                <div className="col-span-1">
                                                                    <img
                                                                        src={`product_images/${p.image || 'default.jpg'}?t=${Date.now()}`}
                                                                        alt={p.name}
                                                                        className="w-12 h-12 object-cover rounded-lg"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            e.target.src = 'product_images/default.jpg';
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-span-4">
                                                                    <div className="font-semibold text-gray-900">{p.name}</div>
                                                                    {p.description && (
                                                                        <div className="text-sm text-gray-600 truncate max-w-xs">{p.description}</div>
                                                                    )}
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{p.code || 'N/A'}</span>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <span className="font-bold text-[var(--primary-color)]">₱{parseFloat(p.price).toFixed(2)}</span>
                                                                </div>
                                                                <div className="col-span-2">
                                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                        p.is_available == 1
                                                                            ? 'bg-green-100 text-green-800'
                                                                            : 'bg-red-100 text-red-800'
                                                                    }`}>
                                                                        {p.is_available == 1 ? 'Available' : 'Unavailable'}
                                                                    </span>
                                                                </div>
                                                                <div className="col-span-1">
                                                                    <div className="flex flex-col gap-1">
                                                                        <button
                                                                            onClick={() => openEditModal(p)}
                                                                            className="bg-blue-600 text-white px-2 py-1 rounded font-bold hover:bg-blue-700 transition text-xs flex items-center justify-center gap-1"
                                                                            title="Edit"
                                                                        >
                                                                            <i data-lucide="edit" className="w-3 h-3"></i>
                                                                            Edit
                                                                        </button>
                                                                        <button
                                                                            onClick={() => confirmDelete(p)}
                                                                            className="bg-red-600 text-white px-2 py-1 rounded font-bold hover:bg-red-700 transition text-xs flex items-center justify-center gap-1"
                                                                            title="Delete"
                                                                        >
                                                                            <i data-lucide="trash-2" className="w-3 h-3"></i>
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* ADD PRODUCT MODAL - NOW ACCEPTS ALL IMAGE FORMATS */}
                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6">
                        <div className="bg-white rounded-3xl shadow-3xl max-w-2xl w-full max-h-screen overflow-y-auto p-10">
                            <h2 className="text-4xl font-bold text-center text-[var(--primary-color)] mb-8">Add New Product</h2>
                            {message && <div className={`text-center p-4 rounded-xl mb-6 font-bold text-xl ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

                            <form onSubmit={handleAddProduct} className="space-y-6">
                                <input type="text" placeholder="Product Name *" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" />
                                <input type="text" placeholder="Code *" required value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="input" />
                                <input type="number" step="0.01" placeholder="Price *" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="input" />
                                <textarea rows="3" placeholder="Description (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input" />

                                <div>
                                    <label className="block text-lg font-bold mb-2">Product Image (JPG, PNG, GIF, WEBP, SVG, BMP)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            const f = e.target.files[0];
                                            if (f) {
                                                setImageFile(f);
                                                setImagePreview(URL.createObjectURL(f));
                                            }
                                        }}
                                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-[var(--primary-color)] file:text-white hover:file:bg-[var(--secondary-color)]"
                                    />
                                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-6 max-h-80 rounded-xl mx-auto shadow-2xl" />}
                                </div>

                                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input" required>
                                    {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>

                                <div className="flex items-center gap-4">
                                    <input type="checkbox" id="avail" checked={form.is_available} onChange={e => setForm({...form, is_available: e.target.checked})} className="w-6 h-6" />
                                    <label htmlFor="avail" className="text-xl">Available for sale</label>
                                </div>

                                <div className="flex justify-center gap-8 pt-6">
                                    <button type="button" onClick={() => { setShowAddModal(false); setImagePreview(''); }} className="px-12 py-4 bg-gray-500 text-white rounded-xl font-bold text-xl hover:bg-gray-600">Cancel</button>
                                    <button type="submit" className="btn-success text-2xl px-16">Add Product</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* EDIT PRODUCT MODAL */}
                {showEditModal && editingProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6">
                        <div className="bg-white rounded-3xl shadow-3xl max-w-2xl w-full max-h-screen overflow-y-auto p-10">
                            <h2 className="text-4xl font-bold text-center text-[var(--primary-color)] mb-8">Edit Product</h2>
                            {message && <div className={`text-center p-4 rounded-xl mb-6 font-bold text-xl ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

                            <form onSubmit={handleEditProduct} className="space-y-6">
                                <input type="text" placeholder="Product Name *" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" />
                                <input type="text" placeholder="Code *" required value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="input" />
                                <input type="number" step="0.01" placeholder="Price *" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="input" />
                                <textarea rows="3" placeholder="Description (optional)" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input" />

                                <div>
                                    <label className="block text-lg font-bold mb-2">Product Image (JPG, PNG, GIF, WEBP, SVG, BMP) - Optional</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => {
                                            const f = e.target.files[0];
                                            if (f) {
                                                setImageFile(f);
                                                setImagePreview(URL.createObjectURL(f));
                                            }
                                        }}
                                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-[var(--primary-color)] file:text-white hover:file:bg-[var(--secondary-color)]"
                                    />
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="mt-6 max-h-80 rounded-xl mx-auto shadow-2xl" />
                                    ) : editingProduct.image ? (
                                        <img src={`product_images/${editingProduct.image}?t=${Date.now()}`} alt="Current" className="mt-6 max-h-80 rounded-xl mx-auto shadow-2xl" />
                                    ) : null}
                                </div>

                                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input" required>
                                    {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>

                                <div className="flex items-center gap-4">
                                    <input type="checkbox" id="edit_avail" checked={form.is_available} onChange={e => setForm({...form, is_available: e.target.checked})} className="w-6 h-6" />
                                    <label htmlFor="edit_avail" className="text-xl">Available for sale</label>
                                </div>

                                <div className="flex justify-center gap-8 pt-6">
                                    <button type="button" onClick={() => { setShowEditModal(false); setEditingProduct(null); setImagePreview(''); }} className="px-12 py-4 bg-gray-500 text-white rounded-xl font-bold text-xl hover:bg-gray-600">Cancel</button>
                                    <button type="submit" className="btn-success text-2xl px-16">Update Product</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* DELETE MODAL */}
                {showDeleteModal && deletingProduct && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6">
                        <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-3xl">
                            <img
                                src={`product_images/${deletingProduct.image || 'default.jpg'}`}
                                alt=""
                                className="w-32 h-32 object-cover rounded-full mx-auto mb-6 border-4 border-red-300"
                                onError={e => e.target.src = 'product_images/default.jpg'}
                            />
                            <h2 className="text-4xl font-bold mb-6">Delete "{deletingProduct.name}"?</h2>
                            <div className="flex gap-6 justify-center">
                                <button onClick={() => setShowDeleteModal(false)} className="px-12 py-5 bg-gray-500 text-white rounded-xl font-bold text-xl">Cancel</button>
                                <button onClick={handleDelete} className="btn-danger text-xl px-12">Delete Forever</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* FIXED POSITION ADD PRODUCT BUTTON */}
                <button
                    onClick={() => setShowAddModal(true)}
                    className="fixed bottom-6 right-6 btn-primary rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 z-40 w-16 h-16 flex items-center justify-center text-2xl font-bold"
                    title="Add New Product"
                >
                    +
                </button>
            </main>
        </div>
    );
}

// Render App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<InventoryApp />);
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        lucide.createIcons();
    }
});