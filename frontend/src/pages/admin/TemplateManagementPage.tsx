import React, { useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, FileImage, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllTemplates, useAddOrUpdateTemplate, useDeleteTemplate } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { Template } from '../../backend';

const emptyTemplate: Template = {
  id: '',
  name: '',
  imageData: '',
  photoSlots: BigInt(1),
  dpiSettings: BigInt(300),
  previewData: '',
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

export default function TemplateManagementPage() {
  const { data: templates, isLoading } = useGetAllTemplates();
  const addOrUpdate = useAddOrUpdateTemplate();
  const deleteTemplate = useDeleteTemplate();

  const [showForm, setShowForm] = useState(false);
  const [editTemplate, setEditTemplate] = useState<Template>(emptyTemplate);

  const handleEdit = (template: Template) => {
    setEditTemplate(template);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditTemplate({ ...emptyTemplate, id: `tmpl-${Date.now()}` });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTemplate.name.trim()) {
      toast.error('Template name is required');
      return;
    }
    try {
      await addOrUpdate.mutateAsync(editTemplate);
      toast.success('Template saved!');
      setShowForm(false);
    } catch {
      toast.error('Failed to save template');
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!confirm('Delete this template?')) return;
    try {
      await deleteTemplate.mutateAsync(templateId);
      toast.success('Template deleted');
    } catch {
      toast.error('Failed to delete template');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground font-display">Templates</h2>
          <p className="text-muted-foreground mt-1">Manage frame templates and photo slots</p>
        </div>
        <Button
          className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl gap-2"
          onClick={handleNew}
        >
          <Plus className="h-4 w-4" />
          Add Template
        </Button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-foreground/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card rounded-3xl shadow-card-hover border border-border w-full max-w-md my-4">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="font-bold text-foreground text-lg">
                {templates?.find((t) => t.id === editTemplate.id) ? 'Edit Template' : 'New Template'}
              </h3>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <Label>Name *</Label>
                <Input
                  value={editTemplate.name}
                  onChange={(e) => setEditTemplate({ ...editTemplate, name: e.target.value })}
                  placeholder="Template name"
                  className="mt-1 rounded-xl"
                  required
                />
              </div>

              <ImageUploadField
                label="Template Image"
                value={editTemplate.imageData}
                onChange={(base64) => setEditTemplate({ ...editTemplate, imageData: base64 })}
              />

              <ImageUploadField
                label="Preview Image"
                value={editTemplate.previewData}
                onChange={(base64) => setEditTemplate({ ...editTemplate, previewData: base64 })}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Photo Slots</Label>
                  <Input
                    type="number"
                    value={Number(editTemplate.photoSlots)}
                    onChange={(e) =>
                      setEditTemplate({ ...editTemplate, photoSlots: BigInt(parseInt(e.target.value) || 1) })
                    }
                    className="mt-1 rounded-xl"
                    min={1}
                    max={20}
                  />
                </div>
                <div>
                  <Label>DPI Settings</Label>
                  <Input
                    type="number"
                    value={Number(editTemplate.dpiSettings)}
                    onChange={(e) =>
                      setEditTemplate({ ...editTemplate, dpiSettings: BigInt(parseInt(e.target.value) || 300) })
                    }
                    className="mt-1 rounded-xl"
                    min={72}
                    max={600}
                  />
                </div>
              </div>

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
                  {addOrUpdate.isPending ? 'Saving...' : 'Save Template'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : !templates || templates.length === 0 ? (
        <div className="bg-card rounded-2xl shadow-card border border-border p-12 text-center">
          <FileImage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No templates yet. Add your first template!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-card rounded-2xl shadow-card border border-border overflow-hidden"
            >
              <div className="aspect-video bg-secondary overflow-hidden">
                {template.previewData || template.imageData ? (
                  <img
                    src={template.previewData || template.imageData}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileImage className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground">{template.name}</h3>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span>
                    {Number(template.photoSlots)} slot{Number(template.photoSlots) !== 1 ? 's' : ''}
                  </span>
                  <span>{Number(template.dpiSettings)} DPI</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl gap-1"
                    onClick={() => handleEdit(template)}
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(template.id)}
                    disabled={deleteTemplate.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
