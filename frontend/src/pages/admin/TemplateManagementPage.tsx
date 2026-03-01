import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import { useGetAllTemplates, useCreateTemplate, useUpdateTemplate, useDeleteTemplate } from '../../hooks/useQueries';
import type { Template } from '../../backend';
import { toast } from 'sonner';

const emptyTemplate: Omit<Template, 'dpiSettings' | 'photoSlots'> & { dpiSettings: number; photoSlots: number } = {
  id: '',
  name: '',
  imageData: '',
  photoSlots: 1,
  dpiSettings: 300,
  previewData: '',
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

export default function TemplateManagementPage() {
  const { data: templates, isLoading } = useGetAllTemplates();
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();

  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<(Omit<Template, 'dpiSettings' | 'photoSlots'> & { dpiSettings: number; photoSlots: number }) | null>(null);
  const [form, setForm] = useState<Omit<Template, 'dpiSettings' | 'photoSlots'> & { dpiSettings: number; photoSlots: number }>(emptyTemplate);
  const [imageUploading, setImageUploading] = useState(false);
  const [previewUploading, setPreviewUploading] = useState(false);

  const openCreate = () => {
    setEditingTemplate(null);
    setForm({ ...emptyTemplate, id: `tmpl_${Date.now()}` });
    setShowModal(true);
  };

  const openEdit = (template: Template) => {
    const t = {
      ...template,
      dpiSettings: Number(template.dpiSettings),
      photoSlots: Number(template.photoSlots),
    };
    setEditingTemplate(t);
    setForm(t);
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageData' | 'previewData') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const setter = field === 'imageData' ? setImageUploading : setPreviewUploading;
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

    const templateData: Template = {
      ...form,
      dpiSettings: BigInt(form.dpiSettings),
      photoSlots: BigInt(form.photoSlots),
    };

    try {
      if (editingTemplate) {
        await updateTemplate.mutateAsync(templateData);
        toast.success('Template updated successfully');
      } else {
        await createTemplate.mutateAsync(templateData);
        toast.success('Template created successfully');
      }
      setShowModal(false);
    } catch {
      toast.error('Failed to save template');
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    try {
      await deleteTemplate.mutateAsync(templateId);
      toast.success('Template deleted');
    } catch {
      toast.error('Failed to delete template');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage photo templates</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" /> Add Template
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !templates || templates.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p>No templates yet. Add your first template!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div key={template.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="aspect-video bg-muted overflow-hidden">
                {template.imageData ? (
                  <img
                    src={`data:image/jpeg;base64,${template.imageData}`}
                    alt={template.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/assets/generated/photo-print-1.dim_600x600.png'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{template.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {Number(template.photoSlots)} slot{Number(template.photoSlots) !== 1 ? 's' : ''} · {Number(template.dpiSettings)} DPI
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => openEdit(template)}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
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
              <h2 className="text-lg font-semibold">{editingTemplate ? 'Edit Template' : 'Add Template'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Template ID</label>
                  <input
                    type="text"
                    value={form.id}
                    onChange={(e) => setForm(prev => ({ ...prev, id: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={!!editingTemplate}
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
                  <label className="block text-sm font-medium mb-1">Photo Slots</label>
                  <input
                    type="number"
                    value={form.photoSlots}
                    onChange={(e) => setForm(prev => ({ ...prev, photoSlots: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">DPI Settings</label>
                  <input
                    type="number"
                    value={form.dpiSettings}
                    onChange={(e) => setForm(prev => ({ ...prev, dpiSettings: parseInt(e.target.value) || 300 }))}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    min="72"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Template Image</label>
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
                <label className="block text-sm font-medium mb-1">Preview Image</label>
                <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted transition-colors">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {previewUploading ? 'Processing...' : form.previewData ? 'Preview uploaded ✓' : 'Upload preview'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'previewData')}
                    disabled={previewUploading}
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
                  disabled={createTemplate.isPending || updateTemplate.isPending || imageUploading || previewUploading}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {(createTemplate.isPending || updateTemplate.isPending) ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingTemplate ? 'Update' : 'Create'
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
