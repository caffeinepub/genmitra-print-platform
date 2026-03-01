import React, { useState } from 'react';
import { Settings, Plus, Trash2, Shield, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAddPincode, useRemovePincode } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
  const addPincode = useAddPincode();
  const removePincode = useRemovePincode();

  const [newPincode, setNewPincode] = useState('');
  const [removePincodeInput, setRemovePincodeInput] = useState('');
  const [localPincodes, setLocalPincodes] = useState<string[]>([]);

  const handleAddPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    try {
      await addPincode.mutateAsync(newPincode);
      setLocalPincodes((prev) => [...new Set([...prev, newPincode])]);
      toast.success(`Pincode ${newPincode} added successfully`);
      setNewPincode('');
    } catch {
      toast.error('Failed to add pincode. Make sure you are logged in as admin.');
    }
  };

  const handleRemovePincodeFromList = async (pincode: string) => {
    try {
      await removePincode.mutateAsync(pincode);
      setLocalPincodes((prev) => prev.filter((p) => p !== pincode));
      toast.success(`Pincode ${pincode} removed`);
    } catch {
      toast.error('Failed to remove pincode');
    }
  };

  const handleRemovePincodeForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (removePincodeInput.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    try {
      await removePincode.mutateAsync(removePincodeInput);
      setLocalPincodes((prev) => prev.filter((p) => p !== removePincodeInput));
      toast.success(`Pincode ${removePincodeInput} removed`);
      setRemovePincodeInput('');
    } catch {
      toast.error('Failed to remove pincode');
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground font-display">Settings</h2>
        <p className="text-muted-foreground mt-1">Configure platform settings and delivery zones</p>
      </div>

      {/* Pincode Management */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6">
        <h3 className="font-bold text-foreground text-lg mb-1 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Delivery Pincode Management
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Add or remove pincodes where delivery is available. Customers can check delivery availability on product pages.
        </p>

        {/* Add Pincode */}
        <form onSubmit={handleAddPincode} className="flex gap-3 mb-4">
          <div className="flex-1">
            <Label htmlFor="newPincode">Add Delivery Pincode</Label>
            <Input
              id="newPincode"
              value={newPincode}
              onChange={(e) => setNewPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit pincode"
              className="mt-1 rounded-xl"
              maxLength={6}
            />
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl gap-2"
              disabled={addPincode.isPending || newPincode.length !== 6}
            >
              <Plus className="h-4 w-4" />
              {addPincode.isPending ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </form>

        {/* Local pincode list */}
        {localPincodes.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Added This Session
            </p>
            <div className="flex flex-wrap gap-2">
              {localPincodes.map((pin) => (
                <div
                  key={pin}
                  className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-lg px-3 py-1.5 text-sm font-medium"
                >
                  <span>{pin}</span>
                  <button
                    onClick={() => handleRemovePincodeFromList(pin)}
                    className="hover:text-destructive transition-colors"
                    disabled={removePincode.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        {/* Remove Pincode */}
        <form onSubmit={handleRemovePincodeForm} className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="removePincode">Remove Delivery Pincode</Label>
            <Input
              id="removePincode"
              value={removePincodeInput}
              onChange={(e) => setRemovePincodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit pincode to remove"
              className="mt-1 rounded-xl"
              maxLength={6}
            />
          </div>
          <div className="flex items-end">
            <Button
              type="submit"
              variant="outline"
              className="rounded-xl gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              disabled={removePincode.isPending || removePincodeInput.length !== 6}
            >
              <Trash2 className="h-4 w-4" />
              {removePincode.isPending ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        </form>
      </div>

      {/* Access Control Info */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6">
        <h3 className="font-bold text-foreground text-lg mb-1 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Access Control
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Role-based access control is managed through Internet Identity. Admin access is granted via the platform's access control system.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-foreground">Admin Role</p>
              <p className="text-xs text-muted-foreground">Full access to all admin features</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-foreground">User Role</p>
              <p className="text-xs text-muted-foreground">Access to shopping, orders, and profile</p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Platform Info */}
      <div className="bg-card rounded-2xl shadow-card border border-border p-6">
        <h3 className="font-bold text-foreground text-lg mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Platform Information
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Platform</span>
            <span className="text-foreground font-medium">PrintCraft Studio</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Backend</span>
            <span className="text-foreground font-medium">Internet Computer (ICP)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Storage</span>
            <span className="text-foreground font-medium">Stable Canister Storage</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Authentication</span>
            <span className="text-foreground font-medium">Internet Identity</span>
          </div>
        </div>
      </div>
    </div>
  );
}
