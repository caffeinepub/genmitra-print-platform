import React, { useState, useRef } from 'react';
import { Plus, Edit, Trash2, Image, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { useGetAllTemplates, useCreateTemplate, useUpdateTemplate, useDeleteTemplate } from '../../hooks/useQueries';
import type { Template } from '../../backend';

const emptyTemplate = (): Omit<Template, 'id'> => ({
  name: '',
  imageData: '',
  photoSlots: BigInt(1),
  dpiSettings: BigInt(300),
  previewData: '',
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

export default function TemplateManagementPage() {
  const { data: templates = [], isLoading } = useGetAllTemplates();
  const createTemplate = useCreateTemplate();
  const updateTemplate = useUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Omit<Template, 'id'>>(emptyTemplate());
  const [imagePreview, setImagePreview] = useState<string>('');
  const [previewPreview, setPreviewPreview] = useState<string>('');
  const [isCompressing, setIsCompressing] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const previewInputRef = useRef<HTMLInputElement>(null);

  const openCreate = () => {
    setEditingTemplate(null);
    setFormData(emptyTemplate());
    setImagePreview('');
    setPreviewPreview('');
    setIsModalOpen(true);
  };

  const openEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      imageData: template.imageData,
      photoSlots: template.photoSlots,
      dpiSettings: template.dpiSettings,
      previewData: template.previewData,
    });
    setImagePreview(template.imageData || '');
    setPreviewPreview(template.previewData || '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
    setFormData(emptyTemplate());
    setImagePreview('');
    setPreviewPreview('');
  };

  const handleImageFile = async (file: File, field: 'imageData' | 'previewData') => {
    setIsCompressing(true);
    try {
      const base64 = await compressImageToBase64(file, 800, 0.75);
      if (field === 'imageData') {
        setFormData(prev => ({ ...prev, imageData: base64 }));
        setImagePreview(base64);
      } else {
        setFormData(prev => ({ ...prev, previewData: base64 }));
        setPreviewPreview(base64);
      }
    } catch {
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Template name is required.');
      return;
    }
    if (!formData.imageData) {
      toast.error('Template image is required.');
      return;
    }

    const templatePayload: Template = {
      id: editingTemplate ? editingTemplate.id : `template_${Date.now()}`,
      name: formData.name.trim(),
      imageData: formData.imageData,
      photoSlots: formData.photoSlots,
      dpiSettings: formData.dpiSettings,
      previewData: formData.previewData,
    };

    try {
      if (editingTemplate) {
        await updateTemplate.mutateAsync(templatePayload);
        toast.success('Template updated successfully!');
      } else {
        await createTemplate.mutateAsync(templatePayload);
        toast.success('Template created successfully!');
      }
      closeModal();
    } catch (err: any) {
      const message = err?.message || 'Unknown error';
      toast.error(`Failed to save template: ${message}`);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await deleteTemplate.mutateAsync(templateId);
      toast.success('Template deleted successfully!');
    } catch (err: any) {
      const message = err?.message || 'Unknown error';
      toast.error(`Failed to delete template: ${message}`);
    }
  };

  const isSaving = createTemplate.isPending || updateTemplate.isPending;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Template Management</h1>
          <p className="text-muted-foreground mt-1">Manage photo templates for the editor</p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Template
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Image className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium">No templates yet</p>
          <p className="text-sm mt-1">Click "Add Template" to create your first template.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="aspect-square bg-muted relative">
                {template.imageData ? (
                  <img
                    src={template.imageData}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-10 h-10 text-muted-foreground opacity-40" />
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <h3 className="font-semibold text-sm truncate">{template.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {Number(template.photoSlots)} slot{Number(template.photoSlots) !== 1 ? 's' : ''} · {Number(template.dpiSettings)} DPI
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEdit(template)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                    disabled={deleteTemplate.isPending}
                  >
                    {deleteTemplate.isPending ? (
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
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? 'Edit Template' : 'Add New Template'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="templateName">Template Name *</Label>
              <Input
                id="templateName"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Classic Portrait"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="photoSlots">Photo Slots</Label>
              <Input
                id="photoSlots"
                type="number"
                min={1}
                max={20}
                value={Number(formData.photoSlots)}
                onChange={(e) => setFormData(prev => ({ ...prev, photoSlots: BigInt(parseInt(e.target.value) || 1) }))}
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

            {/* Template Image */}
            <div>
              <Label>Template Image *</Label>
              <div
                className="mt-1 border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => imageInputRef.current?.click()}
              >
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Template preview" className="max-h-40 mx-auto rounded object-contain" />
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
                    <p className="text-sm text-muted-foreground">Click to upload template image</p>
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

            {/* Preview Image */}
            <div>
              <Label>Preview Image</Label>
              <div
                className="mt-1 border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => previewInputRef.current?.click()}
              >
                {previewPreview ? (
                  <div className="relative">
                    <img src={previewPreview} alt="Preview" className="max-h-40 mx-auto rounded object-contain" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewPreview('');
                        setFormData(prev => ({ ...prev, previewData: '' }));
                        if (previewInputRef.current) previewInputRef.current.value = '';
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="py-4">
                    <Image className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload preview image</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP (max 800px)</p>
                  </div>
                )}
              </div>
              <input
                ref={previewInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFile(file, 'previewData');
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
                ) : editingTemplate ? (
                  'Update Template'
                ) : (
                  'Create Template'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
