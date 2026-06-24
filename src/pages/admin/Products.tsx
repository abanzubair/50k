import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Eye, Search, Download } from 'lucide-react';
import { productStore, categoryStore, activityStore } from '@/lib/store';
import type { Product } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(productStore.getAll());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = categoryStore.getAll();

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'All') {
      result = result.filter((p) => p.category === categoryFilter);
    }
    if (statusFilter !== 'All') {
      result = result.filter((p) => p.status === statusFilter.toLowerCase());
    }
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    }
    return result;
  }, [products, search, categoryFilter, statusFilter, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  const handleDelete = () => {
    if (productToDelete) {
      productStore.delete(productToDelete.id);
      setProducts([...productStore.getAll()]);
      activityStore.add(`Product "${productToDelete.name}" deleted`, 'product');
      setProductToDelete(null);
    }
  };

  const handleSave = (formData: Omit<Product, 'id' | 'createdAt'>) => {
    if (editingProduct) {
      productStore.update(editingProduct.id, formData);
      activityStore.add(`Product "${formData.name}" updated`, 'product');
    } else {
      productStore.add(formData);
      activityStore.add(`Product "${formData.name}" added`, 'product');
    }
    setProducts([...productStore.getAll()]);
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'var(--color-danger)';
    if (stock <= 10) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display font-semibold text-h2" style={{ color: 'var(--color-text)' }}>
          Products
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Export functionality coming soon!')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-colors duration-200 hover:bg-black/5"
            style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <button
            onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-pill font-body text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-muted)' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-pill text-sm font-body outline-none"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-9 px-3 rounded-lg text-sm font-body outline-none cursor-pointer"
          style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-lg text-sm font-body outline-none cursor-pointer"
          style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-9 px-3 rounded-lg text-sm font-body outline-none cursor-pointer"
          style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
        >
          <option value="newest">Newest First</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
        </select>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'rgba(0,0,0,0.02)' }}>
                <th className="text-left px-4 py-3 font-body font-medium text-xs w-12" style={{ color: 'var(--color-muted)' }}>
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left px-4 py-3 font-body font-medium text-xs w-16" style={{ color: 'var(--color-muted)' }}>Image</th>
                <th className="text-left px-4 py-3 font-body font-medium text-xs" style={{ color: 'var(--color-muted)' }}>Product</th>
                <th className="text-left px-4 py-3 font-body font-medium text-xs" style={{ color: 'var(--color-muted)' }}>Price</th>
                <th className="text-left px-4 py-3 font-body font-medium text-xs" style={{ color: 'var(--color-muted)' }}>Stock</th>
                <th className="text-left px-4 py-3 font-body font-medium text-xs" style={{ color: 'var(--color-muted)' }}>Status</th>
                <th className="text-left px-4 py-3 font-body font-medium text-xs w-28" style={{ color: 'var(--color-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-black/[0.02] transition-colors" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td className="px-4 py-3">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-body font-medium text-sm">{product.name}</p>
                    <p className="font-body text-[11px]" style={{ color: 'var(--color-muted)' }}>{product.category}</p>
                  </td>
                  <td className="px-4 py-3 font-body text-sm font-medium">{formatPrice(product.price)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getStockColor(product.stock) }} />
                      <span className="font-body text-sm">{product.stock}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="font-body text-[11px] font-medium px-2.5 py-1 rounded-pill capitalize"
                      style={{
                        backgroundColor: product.status === 'active' ? 'rgba(91,138,91,0.1)' : 'rgba(138,122,114,0.1)',
                        color: product.status === 'active' ? 'var(--color-success)' : 'var(--color-muted)',
                      }}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="w-8 h-8 rounded flex items-center justify-center transition-colors hover:bg-black/5"
                      >
                        <Eye className="w-4 h-4" style={{ color: 'var(--color-muted)' }} />
                      </button>
                      <button
                        onClick={() => { setEditingProduct(product); setIsFormOpen(true); }}
                        className="w-8 h-8 rounded flex items-center justify-center transition-colors hover:bg-black/5"
                      >
                        <Pencil className="w-4 h-4" style={{ color: 'var(--color-muted)' }} />
                      </button>
                      <button
                        onClick={() => setProductToDelete(product)}
                        className="w-8 h-8 rounded flex items-center justify-center transition-colors hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" style={{ color: 'var(--color-danger)' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <p className="font-body text-sm" style={{ color: 'var(--color-muted)' }}>
            Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg font-body text-sm disabled:opacity-40 transition-colors hover:bg-black/5"
              style={{ border: '1px solid var(--color-border)' }}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 rounded-lg font-body text-sm transition-colors"
                style={{
                  backgroundColor: currentPage === page ? 'var(--color-accent)' : 'transparent',
                  color: currentPage === page ? 'var(--color-bg)' : 'var(--color-text)',
                }}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg font-body text-sm disabled:opacity-40 transition-colors hover:bg-black/5"
              style={{ border: '1px solid var(--color-border)' }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Product Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-[640px] max-h-[85vh] overflow-y-auto" style={{ backgroundColor: 'var(--color-bg)' }}>
          <DialogHeader>
            <DialogTitle className="font-display font-semibold text-xl">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            categories={categories.map((c) => c.name)}
            onSave={handleSave}
            onCancel={() => { setIsFormOpen(false); setEditingProduct(null); }}
          />
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-md" style={{ backgroundColor: 'var(--color-bg)' }}>
          {selectedProduct && (
            <div>
              <div className="aspect-[3/4] rounded-lg overflow-hidden mb-4">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <span className="font-body text-xs tracking-wider uppercase" style={{ color: 'var(--color-accent)' }}>
                {selectedProduct.category}
              </span>
              <h3 className="font-display font-semibold text-xl mt-1 mb-2">{selectedProduct.name}</h3>
              <p className="font-body text-sm mb-4" style={{ color: 'var(--color-muted)' }}>{selectedProduct.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span style={{ color: 'var(--color-muted)' }}>Price</span>
                  <p className="font-medium">{formatPrice(selectedProduct.price)}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--color-muted)' }}>Stock</span>
                  <p className="font-medium">{selectedProduct.stock}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--color-muted)' }}>Material</span>
                  <p className="font-medium">{selectedProduct.material}</p>
                </div>
                <div>
                  <span style={{ color: 'var(--color-muted)' }}>SKU</span>
                  <p className="font-medium">{selectedProduct.sku}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent style={{ backgroundColor: 'var(--color-bg)' }}>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display font-semibold">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              This will permanently delete <strong>{productToDelete?.name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setProductToDelete(null)}
              className="font-body"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="font-body"
              style={{ backgroundColor: 'var(--color-danger)' }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Product Form Component
function ProductForm({
  product,
  categories,
  onSave,
  onCancel,
}: {
  product: Product | null;
  categories: string[];
  onSave: (data: Omit<Product, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    compareAtPrice: product?.compareAtPrice || 0,
    category: product?.category || categories[0] || '',
    material: product?.material || '',
    stock: product?.stock || 0,
    sku: product?.sku || '',
    image: product?.image || '/images/saree-1.jpg',
    status: product?.status || 'active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form as Omit<Product, 'id' | 'createdAt'>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block font-body text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Product Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full h-10 px-3 rounded-lg text-sm font-body outline-none"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block font-body text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none resize-none"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full h-10 px-3 rounded-lg text-sm font-body outline-none"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-body text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Material</label>
          <input
            type="text"
            value={form.material}
            onChange={(e) => setForm({ ...form, material: e.target.value })}
            className="w-full h-10 px-3 rounded-lg text-sm font-body outline-none"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Price (₹)</label>
          <input
            type="number"
            required
            min={0}
            value={form.price}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
            className="w-full h-10 px-3 rounded-lg text-sm font-body outline-none"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Compare-at Price (₹)</label>
          <input
            type="number"
            min={0}
            value={form.compareAtPrice}
            onChange={(e) => setForm({ ...form, compareAtPrice: Number(e.target.value) })}
            className="w-full h-10 px-3 rounded-lg text-sm font-body outline-none"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>SKU</label>
          <input
            type="text"
            required
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            className="w-full h-10 px-3 rounded-lg text-sm font-body outline-none"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
          />
        </div>
        <div>
          <label className="block font-body text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Stock Quantity</label>
          <input
            type="number"
            required
            min={0}
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
            className="w-full h-10 px-3 rounded-lg text-sm font-body outline-none"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block font-body text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Image Path</label>
          <input
            type="text"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full h-10 px-3 rounded-lg text-sm font-body outline-none"
            style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.status === 'active'}
              onChange={(e) => setForm({ ...form, status: e.target.checked ? 'active' : 'draft' })}
              className="w-4 h-4 rounded accent-[var(--color-accent)]"
            />
            <span className="font-body text-sm" style={{ color: 'var(--color-text)' }}>Active (visible on storefront)</span>
          </label>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-lg font-body text-sm transition-colors hover:bg-black/5"
          style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-pill font-body text-sm font-medium transition-all hover:scale-105"
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
        >
          {product ? 'Save Changes' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}
