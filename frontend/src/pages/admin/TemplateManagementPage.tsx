import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useGetAllTemplates, useCreateTemplate, useUpdateTemplate, useDeleteTemplate } from '../../hooks/useQueries';
import { getImageSrc } from '../../utils/imageHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import type { Template } from '../../backend';
import { toast } from 'sonner';

const emptyTemplate = {
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

export default function TemplateManagementPage() {
  const { data: templates = [], isLoading } = useGetAllTemplates();
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [form, setForm] = useState<typeof emptyTemplate>({ ...emptyTemplate });
  const [imageUploading, setImageUploading] = useState(false);
  const [previewUploading, setPreviewUploading] = useState(false);

  const filtered = templates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingTemplate(null);
    setForm({ ...emptyTemplate, id: `template_${Date.now()}` });
    setIsModalOpen(true);
  };

  const openEdit = (template: Template) => {
    setEditingTemplate(template);
    setForm({
      ...template,
      photoSlots: Number(template.photoSlots),
      dpiSettings: Number(template.dpiSettings),
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageData' | 'previewData') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (field === 'imageData') setImageUploading(true);
    else setPreviewUploading(true);
    try {
      const compressed = await compressImage(file);
      setForm((prev) => ({ ...prev, [field]: compressed }));
    } catch {
      toast.error('Failed to process image');
    } finally {
      if (field === 'imageData') setImageUploading(false);
      else setPreviewUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const templateData: Template = {
      ...form,
      photoSlots: BigInt(form.photoSlots),
      dpiSettings: BigInt(form.dpiSettings),
    };
    try {
      if (editingTemplate) {
        await updateTemplate.mutateAsync(templateData);
        toast.success('Template updated successfully');
      } else {
        await createTemplate.mutateAsync(templateData);
        toast.success('Template created successfully');
      }
      setIsModalOpen(false);
    } catch {
      toast.error(editingTemplate ? 'Failed to update template' : 'Failed to create template');
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
          <h1 className="text-2xl font-bold font-serif text-foreground">Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage photo templates for the editor</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Template
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
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
        <div className="text-center py-12 text-muted-foreground">No templates found</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {filtered.map((template) => {
              const imageSrc = getImageSrc(template.imageData);
              const previewSrc = getImageSrc(template.previewData);
              return (
                <div key={template.id} className="flex items-center gap-4 p-4">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                    {previewSrc || imageSrc ? (
                      <img
                        src={previewSrc || imageSrc}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{template.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{Number(template.photoSlots)} photo slot{Number(template.photoSlots) !== 1 ? 's' : ''}</span>
                      <span className="text-xs text-muted-foreground">· {Number(template.dpiSettings)} DPI</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="outline" size="icon" onClick={() => openEdit(template)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(template.id)}
                      disabled={deleteTemplate.isPending}
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
            <DialogTitle>{editingTemplate ? 'Edit Template' : 'Add New Template'}</DialogTitle>
            <DialogDescription className="sr-only">
              {editingTemplate ? 'Edit the details of an existing template.' : 'Fill in the details to create a new template.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Template Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Photo Slots</Label>
                <Input
                  type="number"
                  value={form.photoSlots}
                  onChange={(e) => setForm((p) => ({ ...p, photoSlots: parseInt(e.target.value) || 1 }))}
                  min={1}
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
              <div>
                <Label>Template Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'imageData')}
                  className="mt-1"
                  disabled={imageUploading}
                />
                {imageUploading && <p className="text-xs text-muted-foreground mt-1">Processing...</p>}
                {form.imageData && (
                  <img
                    src={getImageSrc(form.imageData)}
                    alt="Template Preview"
                    className="mt-2 w-24 h-24 object-cover rounded-lg border border-border"
                  />
                )}
              </div>
              <div>
                <Label>Preview Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'previewData')}
                  className="mt-1"
                  disabled={previewUploading}
                />
                {previewUploading && <p className="text-xs text-muted-foreground mt-1">Processing...</p>}
                {form.previewData && (
                  <img
                    src={getImageSrc(form.previewData)}
                    alt="Preview"
                    className="mt-2 w-24 h-24 object-cover rounded-lg border border-border"
                  />
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createTemplate.isPending || updateTemplate.isPending}>
                {(createTemplate.isPending || updateTemplate.isPending) ? 'Saving...' : editingTemplate ? 'Update Template' : 'Create Template'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
