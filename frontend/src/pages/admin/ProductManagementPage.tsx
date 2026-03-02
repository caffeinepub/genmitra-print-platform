import { useState } from 'react';
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react';
import { useGetAllProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useQueries';
import { getImageSrc } from '../../utils/imageHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
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
  deliveryTime: '5-7 business days',
  category: 'Photo Prints',
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
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ProductManagementPage() {
  const { data: products = [], isLoading } = useGetAllProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductInfo | null>(null);
  const [form, setForm] = useState<typeof emptyProduct>({ ...emptyProduct });
  const [sizeInput, setSizeInput] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [templateUploading, setTemplateUploading] = useState(false);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingProduct(null);
    setForm({ ...emptyProduct, id: `product_${Date.now()}` });
    setSizeInput('');
    setIsModalOpen(true);
  };

  const openEdit = (product: ProductInfo) => {
    setEditingProduct(product);
    setForm({
      ...product,
      dpiSettings: Number(product.dpiSettings),
    });
    setSizeInput('');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageData' | 'templateImageData') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (field === 'imageData') setImageUploading(true);
    else setTemplateUploading(true);
    try {
      const compressed = await compressImage(file);
      setForm((prev) => ({ ...prev, [field]: compressed }));
    } catch {
      toast.error('Failed to process image');
    } finally {
      if (field === 'imageData') setImageUploading(false);
      else setTemplateUploading(false);
    }
  };

  const handleAddSize = () => {
    if (sizeInput.trim() && !form.sizeOptions.includes(sizeInput.trim())) {
      setForm((prev) => ({ ...prev, sizeOptions: [...prev.sizeOptions, sizeInput.trim()] }));
      setSizeInput('');
    }
  };

  const handleRemoveSize = (size: string) => {
    setForm((prev) => ({ ...prev, sizeOptions: prev.sizeOptions.filter((s) => s !== size) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData: ProductInfo = {
      ...form,
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
      setIsModalOpen(false);
    } catch (err: unknown) {
      toast.error(editingProduct ? 'Failed to update product' : 'Failed to create product');
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
          <h1 className="text-2xl font-bold font-serif text-foreground">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your product catalog</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-muted rounded-xl h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No products found</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {filtered.map((product) => {
              const imageSrc = getImageSrc(product.imageData);
              return (
                <div key={product.id} className="flex items-center gap-4 p-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                    {imageSrc ? (
                      <img src={imageSrc} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                      <span className="text-xs text-muted-foreground">₹{product.price}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="icon" onClick={() => openEdit(product)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                      disabled={deleteProduct.isPending}
                      className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Product Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Price (₹)</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                  required
                  min={0}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Category</Label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none"
                />
              </div>
              <div>
                <Label>Delivery Time</Label>
                <Input
                  value={form.deliveryTime}
                  onChange={(e) => setForm((p) => ({ ...p, deliveryTime: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>DPI Settings</Label>
                <Input
                  type="number"
                  value={form.dpiSettings}
                  onChange={(e) => setForm((p) => ({ ...p, dpiSettings: parseInt(e.target.value) || 300 }))}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label>Size Options</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    placeholder="e.g. 4x6"
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSize(); } }}
                  />
                  <Button type="button" variant="outline" onClick={handleAddSize}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.sizeOptions.map((size) => (
                    <span key={size} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm">
                      {size}
                      <button type="button" onClick={() => handleRemoveSize(size)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <Label>Product Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'imageData')}
                  className="mt-1"
                  disabled={imageUploading}
                />
                {imageUploading && <p className="text-xs text-muted-foreground mt-1">Processing...</p>}
                {form.imageData && (
                  <img src={getImageSrc(form.imageData)} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-lg border border-border" />
                )}
              </div>
              <div>
                <Label>Template Overlay Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'templateImageData')}
                  className="mt-1"
                  disabled={templateUploading}
                />
                {templateUploading && <p className="text-xs text-muted-foreground mt-1">Processing...</p>}
                {form.templateImageData && (
                  <img src={getImageSrc(form.templateImageData)} alt="Template Preview" className="mt-2 w-24 h-24 object-cover rounded-lg border border-border" />
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
                {(createProduct.isPending || updateProduct.isPending) ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
