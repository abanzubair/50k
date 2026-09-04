import { useState, useEffect, useMemo } from 'react';
import { Search, Trash2, Eye, EyeOff, Check, Edit2, Loader2, Package}  from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAdminTenant } from '@/lib/AdminTenantContext';

export default function AdminProducts() {
  const { tenant } = useAdminTenant();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      if (!tenant?.id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('boutique_products')
          .select('*')
          .eq('tenant_id', tenant.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching boutique products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [tenant?.id]);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category || p.fabric || 'Saree'));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
      const matchesCat =
        filterCategory === 'all' ||
        (p.category || p.fabric || 'Saree') === filterCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, search, filterCategory]);

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const nextStatus = !currentStatus;
      const { error } = await supabase
        .from('boutique_products')
        .update({ is_published: nextStatus })
        .eq('id', id);

      if (error) throw error;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_published: nextStatus } : p))
      );
    } catch (err) {
      alert('Failed to update product visibility');
    }
  };

  const handleSavePrice = async (id: string) => {
    const numPrice = Number(editPrice);
    if (isNaN(numPrice) || numPrice <= 0) {
      alert('Please enter a valid price');
      return;
    }

    setSavingId(id);
    try {
      const { error } = await supabase
        .from('boutique_products')
        .update({ retail_price: numPrice })
        .eq('id', id);

      if (error) throw error;
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, retail_price: numPrice } : p))
      );
      setEditingId(null);
    } catch (err) {
      alert('Failed to update retail price');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this saree from your boutique catalog?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('boutique_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
        <span className="text-xs font-mono">Loading boutique catalog...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">Saree Catalog Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Control your retail selling prices, markups, and live availability for {tenant?.store_name}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sarees by title or SKU..."
            className="w-full h-10 pl-10 pr-4 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white outline-none focus:border-amber-500"
          />
        </div>

        {categories.length > 1 && (
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="h-10 px-4 rounded-xl text-xs bg-slate-900 border border-slate-800 text-slate-200 outline-none focus:border-amber-500 capitalize"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Fabrics' : c}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Catalog Table */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-slate-900 border border-slate-800 rounded-3xl p-8">
          <Package className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h3 className="font-bold text-sm text-white">No Sarees Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {products.length === 0
              ? 'Your boutique catalog has 0 sarees. Browse sarees on Weave365 wholesale and click "Add to My Website" to add them here!'
              : 'No products match your current search criteria.'}
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/40">
                  <th className="py-3.5 px-4">Saree</th>
                  <th className="py-3.5 px-4">Wholesale Base</th>
                  <th className="py-3.5 px-4">Your Retail Price</th>
                  <th className="py-3.5 px-4">Your Profit Margin</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((p) => {
                  const base = Number(p.base_price || 0);
                  const retail = Number(p.retail_price || base);
                  const profit = retail - base;
                  const profitPct = base > 0 ? Math.round((profit / base) * 100) : 0;
                  const isPublished = p.is_published !== false;
                  const isEditing = editingId === p.id;

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      {/* Product Thumbnail & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || '/images/hero-saree.jpg'}
                            alt={p.title}
                            className="w-12 h-14 object-cover rounded-lg border border-slate-800 flex-shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-semibold text-white truncate">{p.title}</p>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {p.sku || p.original_product_id} • {p.fabric || 'Pure Silk'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Base Price */}
                      <td className="py-3 px-4 font-mono text-slate-400">
                        ₹{base.toLocaleString('en-IN')}
                      </td>

                      {/* Retail Selling Price */}
                      <td className="py-3 px-4">
                        {isEditing ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-amber-400 font-bold">₹</span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              className="w-24 px-2 py-1 bg-slate-950 border border-amber-500 rounded-lg text-white font-bold text-xs outline-none"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSavePrice(p.id)}
                              disabled={savingId === p.id}
                              className="p-1.5 rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">
                              ₹{retail.toLocaleString('en-IN')}
                            </span>
                            <button
                              onClick={() => {
                                setEditingId(p.id);
                                setEditPrice(String(retail));
                              }}
                              className="text-slate-500 hover:text-amber-400"
                              title="Edit Price Markup"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Profit Margin */}
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          profit > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          +{profitPct}% (+₹{profit.toLocaleString('en-IN')})
                        </span>
                      </td>

                      {/* Visibility Status */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleTogglePublish(p.id, isPublished)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isPublished
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}
                        >
                          {isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{isPublished ? 'Active' : 'Hidden'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete saree"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
