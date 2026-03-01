import React, { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Package, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllProducts, useAddOrUpdateProduct, useDeleteProduct } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { ProductInfo } from '../../backend';

const CATEGORIES = [
  'Photo Frames',
  'Photo Prints',
  'Photo Magnets',
  'Mugs',
  'Corporate Gifts',
  'Posters',
  'Photobooks',
];

const emptyProduct: ProductInfo = {
  id: '',
  name: '',
  description: '',
  price: 0,
  category: 'Photo Frames',
  sizeOptions: [],
  imageData: '',
  templateImageData: '',
  deliveryTime: '3-5 days',
  dpiSettings: BigInt(300),
};

function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (base64: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1 space-y-2">
        {value ? (
          <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border bg-secondary">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 bg-foreground/70 text-background rounded-full p-1 hover:bg-foreground transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div
            className="w-full h-32 rounded-xl border-2 border-dashed border-border bg-secondary/40 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/70 transition-colors"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="h-6 w-6 text-muted-foreground mb-1" />
            <span className="text-xs text-muted-foreground">Click to upload image</span>
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full rounded-xl gap-2"
          onClick={() => inputRef.current?.click()}
        >
          <Upload className="h-3.5 w-3.5" />
          {value ? 'Change Image' : 'Upload Image'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

export default function ProductManagementPage() {
  const { data: products, isLoading } = useGetAllProducts();
  const addOrUpdate = useAddOrUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductInfo>(emptyProduct);
  const [sizeInput, setSizeInput] = useState('');

  const handleEdit = (product: ProductInfo) => {
    setEditProduct(product);
    setSizeInput(product.sizeOptions.join(', '));
    setShowForm(true);
  };

  const handleNew = () => {
    setEditProduct({ ...emptyProduct, id: `prod-${Date.now()}` });
    setSizeInput('');
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    try {
      const sizes = sizeInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      await addOrUpdate.mutateAsync({ ...editProduct, sizeOptions: sizes });
      toast.success('Product saved!');
      setShowForm(false);
    } catch {
      toast.error('Failed to save product');
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success('Product deleted');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-display">Products</h2>
          <p className="text-muted-foreground mt-1">Manage your product catalog</p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl gap-2"
          onClick={handleNew}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card rounded-3xl shadow-card-hover border border-border w-full max-w-lg my-4">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="font-bold text-foreground text-lg">
                {editProduct.id && products?.find((p) => p.id === editProduct.id)
                  ? 'Edit Product'
                  : 'New Product'}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <Label>Name *</Label>
                <Input
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  placeholder="Product name"
                  className="mt-1 rounded-xl"
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={editProduct.description}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  placeholder="Product description"
                  className="mt-1 w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (₹) *</Label>
                  <Input
                    type="number"
                    value={editProduct.price}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, price: parseFloat(e.target.value) || 0 })
                    }
                    className="mt-1 rounded-xl"
                    min={0}
                    required
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <select
                    value={editProduct.category}
                    onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <Label>Size Options (comma-separated)</Label>
                <Input
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder='5×7", 8×10", 11×14"'
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label>Delivery Time</Label>
                <Input
                  value={editProduct.deliveryTime}
                  onChange={(e) => setEditProduct({ ...editProduct, deliveryTime: e.target.value })}
                  placeholder="3-5 days"
                  className="mt-1 rounded-xl"
                />
              </div>
              <div>
                <Label>DPI Settings</Label>
                <Input
                  type="number"
                  value={Number(editProduct.dpiSettings)}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      dpiSettings: BigInt(parseInt(e.target.value) || 300),
                    })
                  }
                  className="mt-1 rounded-xl"
                  min={72}
                  max={600}
                />
              </div>

              <ImageUploadField
                label="Product Image"
                value={editProduct.imageData}
                onChange={(base64) => setEditProduct({ ...editProduct, imageData: base64 })}
              />

              <ImageUploadField
                label="Template Image"
                value={editProduct.templateImageData}
                onChange={(base64) => setEditProduct({ ...editProduct, templateImageData: base64 })}
              />

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary text-primary-foreground hover:opacity-90 rounded-xl"
                  disabled={addOrUpdate.isPending}
                >
                  {addOrUpdate.isPending ? 'Saving...' : 'Save Product'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : !products || products.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-card border border-border p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Product</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Delivery</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-border hover:bg-secondary/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary shrink-0">
                          {product.imageData ? (
                            <img
                              src={product.imageData}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-xs">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                    <td className="py-3 px-4 font-medium text-foreground">₹{product.price}</td>
                    <td className="py-3 px-4 text-muted-foreground">{product.deliveryTime}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(product.id)}
                          disabled={deleteProduct.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
