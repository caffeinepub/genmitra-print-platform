import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Package,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { ProductInfo } from "../../backend";
import {
  useDeleteProduct,
  useGetProducts,
  useUpsertProduct,
} from "../../hooks/useQueries";
import { demoProducts } from "../../lib/demoProducts";
import { getImageSrc } from "../../utils/imageHelpers";

const CATEGORIES = [
  "Photo Prints",
  "Photo Frames",
  "Photo Magnets",
  "Mugs",
  "Corporate Gifts",
  "Posters with Photo",
  "Canvas Prints",
  "Framed Prints",
  "Unframed Posters",
];

function compressImage(
  file: File,
  maxWidth = 800,
  quality = 0.7,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context unavailable"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface ProductFormData {
  id: string;
  name: string;
  price: string;
  description: string;
  category: string;
  deliveryTime: string;
  sizeOptions: string[];
  sizeInput: string;
  imageData: string;
  templateImageData: string;
  dpiSettings: string;
}

const emptyForm: ProductFormData = {
  id: "",
  name: "",
  price: "",
  description: "",
  category: CATEGORIES[0],
  deliveryTime: "5-7 business days",
  sizeOptions: [],
  sizeInput: "",
  imageData: "",
  templateImageData: "",
  dpiSettings: "300",
};

function productToForm(p: ProductInfo): ProductFormData {
  return {
    id: p.id,
    name: p.name,
    price: Number(p.price).toString(),
    description: p.description,
    category: p.category,
    deliveryTime: p.deliveryTime,
    sizeOptions: [...p.sizeOptions],
    sizeInput: "",
    imageData: p.imageData || "",
    templateImageData: p.templateImageData || "",
    dpiSettings: p.dpiSettings ? Number(p.dpiSettings).toString() : "300",
  };
}

interface ProductFormProps {
  form: ProductFormData;
  setForm: React.Dispatch<React.SetStateAction<ProductFormData>>;
  imagePreview: string;
  setImagePreview: (v: string) => void;
  templateImagePreview: string;
  setTemplateImagePreview: (v: string) => void;
  uploadingImage: boolean;
  setUploadingImage: (v: boolean) => void;
  uploadingTemplateImage: boolean;
  setUploadingTemplateImage: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
}

function ProductForm({
  form,
  setForm,
  imagePreview,
  setImagePreview,
  templateImagePreview,
  setTemplateImagePreview,
  uploadingImage,
  setUploadingImage,
  uploadingTemplateImage,
  setUploadingTemplateImage,
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const templateFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const compressed = await compressImage(file);
      setForm((f) => ({ ...f, imageData: compressed }));
      setImagePreview(compressed);
    } catch {
      toast.error("Failed to process image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleTemplateImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingTemplateImage(true);
    try {
      const compressed = await compressImage(file);
      setForm((f) => ({ ...f, templateImageData: compressed }));
      setTemplateImagePreview(compressed);
    } catch {
      toast.error("Failed to process template image");
    } finally {
      setUploadingTemplateImage(false);
    }
  };

  const addSize = () => {
    const val = form.sizeInput.trim();
    if (!val) return;
    if (form.sizeOptions.includes(val)) {
      toast.error("Size already added");
      return;
    }
    setForm((f) => ({
      ...f,
      sizeOptions: [...f.sizeOptions, val],
      sizeInput: "",
    }));
  };

  const removeSize = (size: string) => {
    setForm((f) => ({
      ...f,
      sizeOptions: f.sizeOptions.filter((s) => s !== size),
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-2 bg-white">
      {/* Name */}
      <div className="space-y-1">
        <Label htmlFor="prod-name">Product Name *</Label>
        <Input
          id="prod-name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Classic Photo Frame"
          required
          data-ocid="product.name.input"
        />
      </div>

      {/* Price + Category */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="prod-price">Price (₹) *</Label>
          <Input
            id="prod-price"
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            placeholder="e.g. 599"
            required
            data-ocid="product.price.input"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="prod-category">Category</Label>
          <select
            id="prod-category"
            value={form.category}
            onChange={(e) =>
              setForm((f) => ({ ...f, category: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            data-ocid="product.category.select"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label htmlFor="prod-desc">Description</Label>
        <Textarea
          id="prod-desc"
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="Product description"
          rows={3}
          data-ocid="product.description.textarea"
        />
      </div>

      {/* Delivery + DPI */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="prod-delivery">Delivery Time</Label>
          <Input
            id="prod-delivery"
            value={form.deliveryTime}
            onChange={(e) =>
              setForm((f) => ({ ...f, deliveryTime: e.target.value }))
            }
            placeholder="e.g. 5-7 business days"
            data-ocid="product.delivery_time.input"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="prod-dpi">DPI Settings</Label>
          <Input
            id="prod-dpi"
            type="number"
            value={form.dpiSettings}
            onChange={(e) =>
              setForm((f) => ({ ...f, dpiSettings: e.target.value }))
            }
            placeholder="e.g. 300"
            data-ocid="product.dpi.input"
          />
        </div>
      </div>

      {/* Size Options */}
      <div className="space-y-1">
        <Label>Size Options</Label>
        <div className="flex gap-2">
          <Input
            value={form.sizeInput}
            onChange={(e) =>
              setForm((f) => ({ ...f, sizeInput: e.target.value }))
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSize();
              }
            }}
            placeholder="e.g. 4×6"
            data-ocid="product.size.input"
          />
          <Button
            type="button"
            variant="outline"
            onClick={addSize}
            data-ocid="product.size.add_button"
          >
            Add
          </Button>
        </div>
        {form.sizeOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.sizeOptions.map((size) => (
              <Badge
                key={size}
                variant="secondary"
                className="flex items-center gap-1 pr-1 cursor-pointer"
              >
                {size}
                <button
                  type="button"
                  onClick={() => removeSize(size)}
                  className="ml-1 rounded-full hover:bg-gray-300 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      <div className="grid grid-cols-2 gap-4">
        {/* Product Image */}
        <div className="space-y-1">
          <Label>Product Image</Label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-primary transition-colors bg-white min-h-[100px] flex items-center justify-center"
            data-ocid="product.image.dropzone"
          >
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-24 rounded object-contain"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setImagePreview("");
                    setForm((f) => ({ ...f, imageData: "" }));
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : uploadingImage ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              <label
                htmlFor="product-image-upload"
                className="text-gray-400 cursor-pointer"
              >
                <Package className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs">Click to upload</p>
              </label>
            )}
          </div>
          <input
            id="product-image-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            data-ocid="product.image.upload_button"
          />
        </div>

        {/* Template Overlay Image */}
        <div className="space-y-1">
          <Label>Template Overlay Image</Label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-primary transition-colors bg-white min-h-[100px] flex items-center justify-center"
            data-ocid="product.template_image.dropzone"
          >
            {templateImagePreview ? (
              <div className="relative inline-block">
                <img
                  src={templateImagePreview}
                  alt="Template Preview"
                  className="max-h-24 rounded object-contain"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTemplateImagePreview("");
                    setForm((f) => ({ ...f, templateImageData: "" }));
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : uploadingTemplateImage ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            ) : (
              <label
                htmlFor="product-template-upload"
                className="text-gray-400 cursor-pointer"
              >
                <Package className="w-6 h-6 mx-auto mb-1" />
                <p className="text-xs">Click to upload</p>
              </label>
            )}
          </div>
          <input
            ref={templateFileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleTemplateImageUpload}
            data-ocid="product.template_image.upload_button"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-ocid="product.form.cancel_button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          data-ocid="product.form.submit_button"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Saving...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}

export default function ProductManagementPage() {
  const { data: backendProducts = [], isLoading } = useGetProducts();
  // Merge: backend products + demo products (demo fills gaps, backend overrides demo by id)
  const backendIds = new Set(backendProducts.map((p) => p.id));
  const products: ProductInfo[] = [
    ...backendProducts,
    ...demoProducts.filter((p) => !backendIds.has(p.id)),
  ];
  const upsertProduct = useUpsertProduct();
  const deleteProduct = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [templateImagePreview, setTemplateImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingTemplateImage, setUploadingTemplateImage] = useState(false);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price.trim()) {
      toast.error("Name and price are required");
      return;
    }
    const priceNum = Number.parseFloat(form.price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      toast.error("Invalid price");
      return;
    }

    const product: ProductInfo = {
      id: Date.now().toString(),
      name: form.name.trim(),
      price: BigInt(Math.round(priceNum)),
      description: form.description.trim(),
      category: form.category,
      deliveryTime: form.deliveryTime.trim(),
      sizeOptions: form.sizeOptions,
      imageData: form.imageData,
      templateImageData: form.templateImageData,
      dpiSettings: form.dpiSettings
        ? BigInt(Number.parseInt(form.dpiSettings))
        : undefined,
    };

    try {
      await upsertProduct.mutateAsync(product);
      toast.success("Product created successfully");
      setIsCreateOpen(false);
      setForm(emptyForm);
      setImagePreview("");
      setTemplateImagePreview("");
    } catch {
      toast.error("Failed to create product");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price.trim()) {
      toast.error("Name and price are required");
      return;
    }
    const priceNum = Number.parseFloat(form.price);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      toast.error("Invalid price");
      return;
    }

    const product: ProductInfo = {
      id: form.id,
      name: form.name.trim(),
      price: BigInt(Math.round(priceNum)),
      description: form.description.trim(),
      category: form.category,
      deliveryTime: form.deliveryTime.trim(),
      sizeOptions: form.sizeOptions,
      imageData: form.imageData,
      templateImageData: form.templateImageData,
      dpiSettings: form.dpiSettings
        ? BigInt(Number.parseInt(form.dpiSettings))
        : undefined,
    };

    try {
      await upsertProduct.mutateAsync(product);
      toast.success("Product updated successfully");
      setIsEditOpen(false);
      setForm(emptyForm);
      setImagePreview("");
      setTemplateImagePreview("");
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setImagePreview("");
    setTemplateImagePreview("");
    setIsCreateOpen(true);
  };

  const openEdit = (product: ProductInfo) => {
    const f = productToForm(product);
    setForm(f);
    setImagePreview(product.imageData || "");
    setTemplateImagePreview(product.templateImageData || "");
    setIsEditOpen(true);
  };

  return (
    <div className="bg-white min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Product Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {products.length} products total
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="flex items-center gap-2"
          data-ocid="products.add_button"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-ocid="products.search_input"
        />
      </div>

      {/* Product Table */}
      {isLoading ? (
        <div
          className="flex items-center justify-center py-20"
          data-ocid="products.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-20 text-gray-400"
          data-ocid="products.empty_state"
        >
          <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No products found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Product
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Category
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Price
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Sizes
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">
                  Delivery
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product, idx) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                  data-ocid={`products.table.row.${idx + 1}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.imageData ? (
                        <img
                          src={getImageSrc(product.imageData)}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center border border-gray-200">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className="bg-white text-gray-700 border border-gray-300 font-normal">
                      {product.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    ₹{Number(product.price).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.sizeOptions.slice(0, 2).join(", ")}
                    {product.sizeOptions.length > 2 && (
                      <span className="text-gray-400">
                        {" "}
                        +{product.sizeOptions.length - 2}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.deliveryTime}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => openEdit(product)}
                        data-ocid={`products.table.edit_button.${idx + 1}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deleteProduct.isPending}
                        data-ocid={`products.table.delete_button.${idx + 1}`}
                      >
                        {deleteProduct.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Product Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription className="sr-only">
              Fill in the details to create a new product.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            form={form}
            setForm={setForm}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            templateImagePreview={templateImagePreview}
            setTemplateImagePreview={setTemplateImagePreview}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            uploadingTemplateImage={uploadingTemplateImage}
            setUploadingTemplateImage={setUploadingTemplateImage}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
            isPending={upsertProduct.isPending}
            submitLabel="Create Product"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription className="sr-only">
              Update the product details.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            form={form}
            setForm={setForm}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            templateImagePreview={templateImagePreview}
            setTemplateImagePreview={setTemplateImagePreview}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            uploadingTemplateImage={uploadingTemplateImage}
            setUploadingTemplateImage={setUploadingTemplateImage}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditOpen(false)}
            isPending={upsertProduct.isPending}
            submitLabel="Update Product"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
