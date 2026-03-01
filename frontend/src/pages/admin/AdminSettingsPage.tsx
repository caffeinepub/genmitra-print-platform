import React, { useState } from 'react';
import { Plus, Trash2, MapPin, Shield, Info } from 'lucide-react';
import { useAddPincode, useRemovePincode } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const addPincode = useAddPincode();
  const removePincode = useRemovePincode();

  const [newPincode, setNewPincode] = useState('');
  const [pincodeList, setPincodeList] = useState<string[]>([]);
  const [removeInput, setRemoveInput] = useState('');

  const handleAddPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    const pin = newPincode.trim();
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    if (pincodeList.includes(pin)) {
      toast.error('Pincode already added');
      return;
    }
    try {
      await addPincode.mutateAsync(pin);
      setPincodeList(prev => [...prev, pin]);
      setNewPincode('');
      toast.success(`Pincode ${pin} added successfully`);
    } catch {
      toast.error('Failed to add pincode');
    }
  };

  const handleRemovePincode = async (e: React.FormEvent) => {
    e.preventDefault();
    const pin = removeInput.trim();
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    try {
      await removePincode.mutateAsync(pin);
      setPincodeList(prev => prev.filter(p => p !== pin));
      setRemoveInput('');
      toast.success(`Pincode ${pin} removed successfully`);
    } catch {
      toast.error('Failed to remove pincode');
    }
  };

  const handleRemoveFromList = async (pin: string) => {
    try {
      await removePincode.mutateAsync(pin);
      setPincodeList(prev => prev.filter(p => p !== pin));
      toast.success(`Pincode ${pin} removed`);
    } catch {
      toast.error('Failed to remove pincode');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage platform settings</p>
      </div>

      {/* Pincode Management */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Delivery Pincodes</h2>
        </div>

        <form onSubmit={handleAddPincode} className="flex gap-2">
          <input
            type="text"
            value={newPincode}
            onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter 6-digit pincode"
            className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            maxLength={6}
          />
          <button
            type="submit"
            disabled={addPincode.isPending}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {addPincode.isPending ? 'Adding...' : 'Add'}
          </button>
        </form>

        {pincodeList.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">Added this session:</p>
            <div className="flex flex-wrap gap-2">
              {pincodeList.map((pin) => (
                <div key={pin} className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-lg text-sm">
                  <span>{pin}</span>
                  <button
                    onClick={() => handleRemoveFromList(pin)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-border pt-4">
          <p className="text-sm font-medium mb-2">Remove a pincode:</p>
          <form onSubmit={handleRemovePincode} className="flex gap-2">
            <input
              type="text"
              value={removeInput}
              onChange={(e) => setRemoveInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter pincode to remove"
              className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              maxLength={6}
            />
            <button
              type="submit"
              disabled={removePincode.isPending}
              className="flex items-center gap-1.5 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              {removePincode.isPending ? 'Removing...' : 'Remove'}
            </button>
          </form>
        </div>
      </div>

      {/* Access Control Info */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Access Control</h2>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p><span className="font-medium text-foreground">Admin accounts:</span> genmitra, admin</p>
          <p><span className="font-medium text-foreground">Admin credentials</span> are managed in the backend and cannot be changed from this panel.</p>
          <p>Users authenticate via Internet Identity. Admins use username/password credentials.</p>
        </div>
      </div>

      {/* Platform Info */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Platform Information</h2>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p><span className="font-medium text-foreground">Platform:</span> GenMitra Photo Printing</p>
          <p><span className="font-medium text-foreground">Backend:</span> Internet Computer (ICP)</p>
          <p><span className="font-medium text-foreground">Version:</span> 1.0.0</p>
        </div>
      </div>
    </div>
  );
}
