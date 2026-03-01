import React, { useState, useRef } from 'react';
import { Plus, Edit, Trash2, Image, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useGetAllProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useQueries';
import type { ProductInfo } from '../../backend';

const CATEGORIES = ['Photo Frames', 'Mugs', 'Photo Prints', 'Photo Magnets', 'Corporate Gifts'];

const emptyProduct = (): Omit<ProductInfo, 'id'> => ({
  name: '',
  price: 0,
  description: '',
  sizeOptions: [],
  imageData: '',
  templateImageData: '',
  deliveryTime: '5-7 business days',
  category: CATEGORIES[0],
  dpiSettings: BigInt(300),
});

function compressImageToBase64(file: File, maxPx = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxPx || height > maxPx) {
          if (width > height) {
            height = Math.round((height * maxPx) / width);
            width = maxPx;
          } else {
            width = Math.round((width * maxPx) / height);
            height = maxPx;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas context unavailable'));
        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL('image/jpeg', quality);
        resolve(base64);
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductInfo | null>(null);
  const [formData, setFormData] = useState<Omit<ProductInfo, 'id'>>(emptyProduct());
  const [sizeInput, setSizeInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [templateImagePreview, setTemplateImagePreview] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const templateImageInputRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditingProduct(null);
    setFormData(emptyProduct());
    setSizeInput('');
    setImagePreview('');
    setTemplateImagePreview('');
    setIsModalOpen(true);
  };

  const openEdit = (product: ProductInfo) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      description: product.description,
      sizeOptions: [...product.sizeOptions],
      imageData: product.imageData,
      templateImageData: product.templateImageData,
      deliveryTime: product.deliveryTime,
      category: product.category,
      dpiSettings: product.dpiSettings,
    });
    setSizeInput('');
    setImagePreview(product.imageData || '');
    setTemplateImagePreview(product.templateImageData || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData(emptyProduct());
    setSizeInput('');
    setImagePreview('');
    setTemplateImagePreview('');
  };

  const handleImageFile = async (file: File, field: 'imageData' | 'templateImageData') => {
    setIsCompressing(true);
    try {
      const base64 = await compressImageToBase64(file, 800, 0.75);
      if (field === 'imageData') {
        setFormData(prev => ({ ...prev, imageData: base64 }));
        setImagePreview(base64);
      } else {
        setFormData(prev => ({ ...prev, templateImageData: base64 }));
        setTemplateImagePreview(base64);
      }
    } catch {
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsCompressing(false);
    }
  };

  const addSize = () => {
    const trimmed = sizeInput.trim();
    if (trimmed && !formData.sizeOptions.includes(trimmed)) {
      setFormData(prev => ({ ...prev, sizeOptions: [...prev.sizeOptions, trimmed] }));
      setSizeInput('');
    }
  };

  const removeSize = (size: string) => {
    setFormData(prev => ({ ...prev, sizeOptions: prev.sizeOptions.filter(s => s !== size) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Product name is required.');
      return;
    }
    if (!formData.imageData) {
      toast.error('Product image is required.');
      return;
    }
    if (formData.price <= 0) {
      toast.error('Price must be greater than 0.');
      return;
    }

    const productPayload: ProductInfo = {
      id: editingProduct ? editingProduct.id : `product_${Date.now()}`,
      name: formData.name.trim(),
      price: formData.price,
      description: formData.description.trim(),
      sizeOptions: formData.sizeOptions,
      imageData: formData.imageData,
      templateImageData: formData.templateImageData,
      deliveryTime: formData.deliveryTime.trim() || '5-7 business days',
      category: formData.category,
      dpiSettings: formData.dpiSettings,
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync(productPayload);
        toast.success('Product updated successfully!');
      } else {
        await createProduct.mutateAsync(productPayload);
        toast.success('Product created successfully!');
      }
      closeModal();
    } catch (err: any) {
      const message = err?.message || 'Unknown error';
      toast.error(`Failed to save product: ${message}`);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct.mutateAsync(productId);
      toast.success('Product deleted successfully!');
    } catch (err: any) {
      const message = err?.message || 'Unknown error';
      toast.error(`Failed to delete product: ${message}`);
    }
  };

  const isSaving = createProduct.isPending || updateProduct.isPending;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Product Management</h1>
          <p className="text-muted-foreground mt-1">Manage your product catalog</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Image className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No products yet</p>
          <p className="text-sm mt-1">Click "Add Product" to create your first product.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square bg-muted relative">
                {product.imageData ? (
                  <img
                    src={product.imageData}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-10 h-10 text-muted-foreground opacity-40" />
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                <p className="text-sm font-bold text-primary mt-1">₹{product.price.toFixed(2)}</p>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEdit(product)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    disabled={deleteProduct.isPending}
                  >
                    {deleteProduct.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Classic Photo Frame"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="productPrice">Price (₹) *</Label>
                <Input
                  id="productPrice"
                  type="number"
                  min={0}
                  step={0.01}
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="productCategory">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="productDescription">Description</Label>
                <Textarea
                  id="productDescription"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Product description..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="deliveryTime">Delivery Time</Label>
                <Input
                  id="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, deliveryTime: e.target.value }))}
                  placeholder="e.g. 5-7 business days"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="dpiSettings">DPI Settings</Label>
                <Input
                  id="dpiSettings"
                  type="number"
                  min={72}
                  max={1200}
                  value={Number(formData.dpiSettings)}
                  onChange={(e) => setFormData(prev => ({ ...prev, dpiSettings: BigInt(parseInt(e.target.value) || 300) }))}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Size Options */}
            <div>
              <Label>Size Options</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={sizeInput}
                  onChange={(e) => setSizeInput(e.target.value)}
                  placeholder="e.g. 4x6, 5x7, 8x10"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSize(); } }}
                />
                <Button type="button" variant="outline" onClick={addSize}>Add</Button>
              </div>
              {formData.sizeOptions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.sizeOptions.map(size => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full"
                    >
                      {size}
                      <button type="button" onClick={() => removeSize(size)}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Product Image */}
            <div>
              <Label>Product Image *</Label>
              <div
                className="mt-1 border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => imageInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Product" className="max-h-40 mx-auto rounded object-contain" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImagePreview('');
                        setFormData(prev => ({ ...prev, imageData: '' }));
                        if (imageInputRef.current) imageInputRef.current.value = '';
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="py-4">
                    <Image className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload product image</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP (max 800px)</p>
                  </div>
                )}
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFile(file, 'imageData');
                }}
              />
            </div>

            {/* Template Image */}
            <div>
              <Label>Template Image</Label>
              <div
                className="mt-1 border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => templateImageInputRef.current?.click()}
              >
                {templateImagePreview ? (
                  <div className="relative">
                    <img src={templateImagePreview} alt="Template" className="max-h-40 mx-auto rounded object-contain" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTemplateImagePreview('');
                        setFormData(prev => ({ ...prev, templateImageData: '' }));
                        if (templateImageInputRef.current) templateImageInputRef.current.value = '';
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="py-4">
                    <Image className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload template overlay image</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP (max 800px)</p>
                  </div>
                )}
              </div>
              <input
                ref={templateImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFile(file, 'templateImageData');
                }}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={closeModal} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving || isCompressing}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : isCompressing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : editingProduct ? (
                  'Update Product'
                ) : (
                  'Create Product'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
