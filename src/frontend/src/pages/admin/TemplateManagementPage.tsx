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
import {
  FileImage,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import type { Template } from "../../backend";
import {
  useDeleteTemplate,
  useGetTemplates,
  useUpsertTemplate,
} from "../../hooks/useQueries";
import { getImageSrc } from "../../utils/imageHelpers";

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

interface TemplateFormData {
  id: string;
  name: string;
  photoSlots: string;
  dpiSettings: string;
  imageData: string;
  previewData: string;
}

const emptyForm: TemplateFormData = {
  id: "",
  name: "",
  photoSlots: "1",
  dpiSettings: "300",
  imageData: "",
  previewData: "",
};

function templateToForm(t: Template): TemplateFormData {
  return {
    id: t.id,
    name: t.name,
    photoSlots: Number(t.photoSlots).toString(),
    dpiSettings: Number(t.dpiSettings).toString(),
    imageData: t.imageData || "",
    previewData: t.previewData || "",
  };
}

interface TemplateFormProps {
  form: TemplateFormData;
  setForm: React.Dispatch<React.SetStateAction<TemplateFormData>>;
  imagePreview: string;
  setImagePreview: (v: string) => void;
  uploadingImage: boolean;
  setUploadingImage: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
}

function TemplateForm({
  form,
  setForm,
  imagePreview,
  setImagePreview,
  uploadingImage,
  setUploadingImage,
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: TemplateFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const compressed = await compressImage(file);
      setForm((f) => ({
        ...f,
        imageData: compressed,
        previewData: compressed,
      }));
      setImagePreview(compressed);
    } catch {
      toast.error("Failed to process image");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 mt-2 bg-white">
      <div className="space-y-1">
        <Label htmlFor="tmpl-name">Template Name *</Label>
        <Input
          id="tmpl-name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="Template name"
          required
          data-ocid="template.name.input"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="tmpl-slots">Photo Slots</Label>
          <Input
            id="tmpl-slots"
            type="number"
            min="1"
            value={form.photoSlots}
            onChange={(e) =>
              setForm((f) => ({ ...f, photoSlots: e.target.value }))
            }
            data-ocid="template.photo_slots.input"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="tmpl-dpi">DPI Settings</Label>
          <Input
            id="tmpl-dpi"
            type="number"
            min="72"
            value={form.dpiSettings}
            onChange={(e) =>
              setForm((f) => ({ ...f, dpiSettings: e.target.value }))
            }
            data-ocid="template.dpi.input"
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label>Template Image</Label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors bg-white min-h-[120px] flex items-center justify-center"
          data-ocid="template.image.dropzone"
        >
          {imagePreview ? (
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-32 rounded object-contain"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setImagePreview("");
                  setForm((f) => ({ ...f, imageData: "", previewData: "" }));
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : uploadingImage ? (
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          ) : (
            <label
              htmlFor="template-file-input"
              className="cursor-pointer text-gray-400 block w-full"
            >
              <FileImage className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Click to upload image</p>
            </label>
          )}
        </div>
        <input
          id="template-file-input"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          data-ocid="template.image.upload_button"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          data-ocid="template.form.cancel_button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          data-ocid="template.form.submit_button"
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

export default function TemplateManagementPage() {
  const { data: templates = [], isLoading } = useGetTemplates();
  const upsertTemplate = useUpsertTemplate();
  const deleteTemplate = useDeleteTemplate();

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState<TemplateFormData>(emptyForm);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Template name is required");
      return;
    }
    const template: Template = {
      id: Date.now().toString(),
      name: form.name.trim(),
      photoSlots: BigInt(Number.parseInt(form.photoSlots) || 1),
      dpiSettings: BigInt(Number.parseInt(form.dpiSettings) || 300),
      imageData: form.imageData,
      previewData: form.previewData,
    };
    try {
      await upsertTemplate.mutateAsync(template);
      toast.success("Template created successfully");
      setIsCreateOpen(false);
      setForm(emptyForm);
      setImagePreview("");
    } catch {
      toast.error("Failed to create template");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Template name is required");
      return;
    }
    const template: Template = {
      id: form.id,
      name: form.name.trim(),
      photoSlots: BigInt(Number.parseInt(form.photoSlots) || 1),
      dpiSettings: BigInt(Number.parseInt(form.dpiSettings) || 300),
      imageData: form.imageData,
      previewData: form.previewData,
    };
    try {
      await upsertTemplate.mutateAsync(template);
      toast.success("Template updated successfully");
      setIsEditOpen(false);
      setForm(emptyForm);
      setImagePreview("");
    } catch {
      toast.error("Failed to update template");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete template "${name}"? This cannot be undone.`)) return;
    try {
      await deleteTemplate.mutateAsync(id);
      toast.success("Template deleted");
    } catch {
      toast.error("Failed to delete template");
    }
  };

  const openCreate = () => {
    setForm(emptyForm);
    setImagePreview("");
    setIsCreateOpen(true);
  };

  const openEdit = (t: Template) => {
    setForm(templateToForm(t));
    setImagePreview(t.previewData || t.imageData || "");
    setIsEditOpen(true);
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Template Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {templates.length} templates total
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="flex items-center gap-2"
          data-ocid="templates.add_button"
        >
          <Plus className="w-4 h-4" />
          Add Template
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-ocid="templates.search_input"
        />
      </div>

      {isLoading ? (
        <div
          className="flex items-center justify-center py-20"
          data-ocid="templates.loading_state"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-20 text-gray-400"
          data-ocid="templates.empty_state"
        >
          <FileImage className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No templates found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((template, idx) => (
            <div
              key={template.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
              data-ocid={`templates.card.${idx + 1}`}
            >
              {/* Preview */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {template.previewData || template.imageData ? (
                  <img
                    src={getImageSrc(
                      template.previewData || template.imageData,
                    )}
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <FileImage className="w-12 h-12 text-gray-300" />
                )}
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="font-medium text-gray-900 truncate">
                  {template.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {Number(template.photoSlots)} slot
                  {Number(template.photoSlots) !== 1 ? "s" : ""} ·{" "}
                  {Number(template.dpiSettings)} DPI
                </p>
              </div>
              {/* Actions */}
              <div className="px-3 pb-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => openEdit(template)}
                  data-ocid={`templates.edit_button.${idx + 1}`}
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleDelete(template.id, template.name)}
                  disabled={deleteTemplate.isPending}
                  data-ocid={`templates.delete_button.${idx + 1}`}
                >
                  {deleteTemplate.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-1" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Template Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>Add New Template</DialogTitle>
            <DialogDescription className="sr-only">
              Fill in the details to create a new template.
            </DialogDescription>
          </DialogHeader>
          <TemplateForm
            form={form}
            setForm={setForm}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            onSubmit={handleCreate}
            onCancel={() => setIsCreateOpen(false)}
            isPending={upsertTemplate.isPending}
            submitLabel="Create Template"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg bg-white">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription className="sr-only">
              Update the template details.
            </DialogDescription>
          </DialogHeader>
          <TemplateForm
            form={form}
            setForm={setForm}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            uploadingImage={uploadingImage}
            setUploadingImage={setUploadingImage}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditOpen(false)}
            isPending={upsertTemplate.isPending}
            submitLabel="Update Template"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
