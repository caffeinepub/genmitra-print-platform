import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import { useGetAllProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useQueries';
import type { ProductInfo } from '../../backend';
import { toast } from 'sonner';

const CATEGORIES = ['Photo Prints', 'Photo Frames', 'Photo Magnets', 'Mugs', 'Corporate Gifts'];

const emptyProduct: Omit<ProductInfo, 'dpiSettings'> & { dpiSettings: number } = {
  id: '',
  name: '',
  price: 0,
  description: '',
  sizeOptions: [],
  imageData: '',
  templateImageData: '',
  deliveryTime: '3-5 business days',
  category: CATEGORIES[0],
  dpiSettings: 300,
};

function compressImage(file: File, maxSize = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas context unavailable')); return; }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl.split(',')[1]);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProductManagementPage() {
  const { data: products, isLoading } = useGetAllProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<(Omit<ProductInfo, 'dpiSettings'> & { dpiSettings: number }) | null>(null);
  const [form, setForm] = useState<Omit<ProductInfo, 'dpiSettings'> & { dpiSettings: number }>(emptyProduct);
  const [sizeInput, setSizeInput] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [templateUploading, setTemplateUploading] = useState(false);

  const openCreate = () => {
    setEditingProduct(null);
    setForm({ ...emptyProduct, id: `prod_${Date.now()}` });
    setSizeInput('');
    setShowModal(true);
  };

  const openEdit = (product: ProductInfo) => {
    setEditingProduct({
      ...product,
      dpiSettings: Number(product.dpiSettings),
    });
    setForm({
      ...product,
      dpiSettings: Number(product.dpiSettings),
    });
    setSizeInput(product.sizeOptions.join(', '));
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageData' | 'templateImageData') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const setter = field === 'imageData' ? setImageUploading : setTemplateUploading;
    setter(true);
    try {
      const compressed = await compressImage(file);
      setForm(prev => ({ ...prev, [field]: compressed }));
    } catch {
      toast.error('Failed to process image');
    } finally {
      setter(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.id.trim()) {
      toast.error('Name and ID are required');
      return;
    }

    const sizes = sizeInput.split(',').map(s => s.trim()).filter(Boolean);
    const productData: ProductInfo = {
      ...form,
      sizeOptions: sizes,
      dpiSettings: BigInt(form.dpiSettings),
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync(productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct.mutateAsync(productData);
        toast.success('Product created successfully');
      }
      setShowModal(false);
    } catch (err) {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="aspect-video bg-muted overflow-hidden">
                {product.imageData ? (
                  <img
                    src={`data:image/jpeg;base64,${product.imageData}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/assets/generated/photo-print-1.dim_600x600.png'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                    <p className="text-primary font-bold mt-1">₹{product.price}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product ID</label>
                  <input
                    type="text"
                    value={form.id}
                    onChange={(e) => setForm(prev => ({ ...prev, id: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={!!editingProduct}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Size Options (comma-separated)</label>
                <input
                  type="text"
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="e.g. 4x6, 5x7, 8x10"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Delivery Time</label>
                <input
                  type="text"
                  value={form.deliveryTime}
                  onChange={(e) => setForm(prev => ({ ...prev, deliveryTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Product Image</label>
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {imageUploading ? 'Processing...' : form.imageData ? 'Image uploaded ✓' : 'Upload image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'imageData')}
                    disabled={imageUploading}
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Template Overlay Image</label>
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {templateUploading ? 'Processing...' : form.templateImageData ? 'Template uploaded ✓' : 'Upload template'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'templateImageData')}
                    disabled={templateUploading}
                  />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProduct.isPending || updateProduct.isPending || imageUploading || templateUploading}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {(createProduct.isPending || updateProduct.isPending) ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingProduct ? 'Update' : 'Create'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Fix missing import
function Package({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
}
