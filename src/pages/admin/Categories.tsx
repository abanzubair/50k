import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { categoryStore, productStore, activityStore } from '@/lib/store';
import type { Category } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>(categoryStore.getAll());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleDelete = () => {
    if (categoryToDelete) {
      const productsInCategory = productStore.getByCategory(categoryToDelete.name);
      if (productsInCategory.length > 0) {
        alert(`Cannot delete: ${productsInCategory.length} products are in this category. Move or delete them first.`);
        setCategoryToDelete(null);
        return;
      }
      categoryStore.delete(categoryToDelete.id);
      setCategories([...categoryStore.getAll()]);
      activityStore.add(`Category "${categoryToDelete.name}" deleted`, 'product');
      setCategoryToDelete(null);
    }
  };

  const handleSave = (formData: Omit<Category, 'id' | 'productCount'>) => {
    if (editingCategory) {
      categoryStore.update(editingCategory.id, { ...formData, productCount: editingCategory.productCount });
      activityStore.add(`Category "${formData.name}" updated`, 'product');
    } else {
      categoryStore.add(formData);
      activityStore.add(`Category "${formData.name}" added`, 'product');
    }
    setCategories([...categoryStore.getAll()]);
    setIsFormOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="font-display font-semibold text-h2" style={{ color: 'var(--color-text)' }}>
          Categories
        </h1>
        <button
          onClick={() => { setEditingCategory(null); setIsFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-pill font-body text-sm font-medium transition-all duration-200 hover:scale-105 self-start"
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-5">
              <h3 className="font-body font-semibold text-lg mb-1" style={{ color: 'var(--color-text)' }}>
                {category.name}
              </h3>
              <p className="font-body text-[13px] mb-1" style={{ color: 'var(--color-muted)' }}>
                {category.productCount} products
              </p>
              <p className="font-body text-sm mb-4 line-clamp-2" style={{ color: 'var(--color-muted)' }}>
                {category.description}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditingCategory(category); setIsFormOpen(true); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs transition-colors hover:bg-black/5"
                  style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => setCategoryToDelete(category)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs transition-colors hover:bg-red-50"
                  style={{ border: '1px solid var(--color-border)', color: 'var(--color-danger)' }}
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Category Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md" style={{ backgroundColor: 'var(--color-bg)' }}>
          <DialogHeader>
            <DialogTitle className="font-display font-semibold text-xl">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={editingCategory}
            onSave={handleSave}
            onCancel={() => { setIsFormOpen(false); setEditingCategory(null); }}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
        <AlertDialogContent style={{ backgroundColor: 'var(--color-bg)' }}>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display font-semibold">Delete Category?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              This will delete <strong>{categoryToDelete?.name}</strong>. Categories with products cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCategoryToDelete(null)} className="font-body">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="font-body" style={{ backgroundColor: 'var(--color-danger)' }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CategoryForm({
  category,
  onSave,
  onCancel,
}: {
  category: Category | null;
  onSave: (data: Omit<Category, 'id' | 'productCount'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: category?.name || '',
    description: category?.description || '',
    image: category?.image || '/images/saree-1.jpg',
    slug: category?.slug || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block font-body text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Category Name</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full h-10 px-3 rounded-lg text-sm font-body outline-none"
          style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
        />
      </div>
      <div>
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
        <label className="block font-body text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>Image URL</label>
        <input
          type="text"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="w-full h-10 px-3 rounded-lg text-sm font-body outline-none"
          style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
        />
      </div>
      <div>
        <label className="block font-body text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>SEO Slug</label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          placeholder="auto-generated from name"
          className="w-full h-10 px-3 rounded-lg text-sm font-body outline-none"
          style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}
        />
        <p className="font-body text-[11px] mt-1" style={{ color: 'var(--color-muted)' }}>
          Leave empty to auto-generate from category name
        </p>
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
          {category ? 'Save Changes' : 'Add Category'}
        </button>
      </div>
    </form>
  );
}
