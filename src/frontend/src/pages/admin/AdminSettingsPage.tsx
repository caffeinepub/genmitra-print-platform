import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info, Loader2, MapPin, Plus, Shield, Trash2 } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  useAddPincode,
  useGetAvailablePincodes,
  useRemovePincode,
} from "../../hooks/useQueries";

export default function AdminSettingsPage() {
  const { data: pincodes = [], isLoading } = useGetAvailablePincodes();
  const addPincode = useAddPincode();
  const removePincode = useRemovePincode();

  const [newPincode, setNewPincode] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const pin = newPincode.trim();
    if (!pin) return;
    if (!/^\d{6}$/.test(pin)) {
      toast.error("Pincode must be exactly 6 digits");
      return;
    }
    if (pincodes.includes(pin)) {
      toast.error("Pincode already exists");
      return;
    }
    try {
      await addPincode.mutateAsync(pin);
      toast.success(`Pincode ${pin} added`);
      setNewPincode("");
    } catch {
      toast.error("Failed to add pincode");
    }
  };

  const handleRemove = async (pin: string) => {
    try {
      await removePincode.mutateAsync(pin);
      toast.success(`Pincode ${pin} removed`);
    } catch {
      toast.error("Failed to remove pincode");
    }
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage platform settings</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Delivery Pincodes */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-gray-900">Delivery Pincodes</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Manage the pincodes where delivery is available.
          </p>

          {/* Add Pincode */}
          <form onSubmit={handleAdd} className="flex gap-2 mb-4">
            <Input
              placeholder="Enter 6-digit pincode"
              value={newPincode}
              onChange={(e) => setNewPincode(e.target.value)}
              maxLength={6}
              className="flex-1"
            />
            <Button type="submit" disabled={addPincode.isPending}>
              {addPincode.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              Add
            </Button>
          </form>

          {/* Pincode List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : pincodes.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">
              No pincodes added yet
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {pincodes.map((pin) => (
                <div
                  key={pin}
                  className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {pin}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemove(pin)}
                    disabled={removePincode.isPending}
                    className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Access Control Info */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-gray-900">Access Control</h2>
          </div>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <Badge variant="default" className="mt-0.5">
                Admin
              </Badge>
              <p>
                Full access to all platform features including product, order,
                and customer management.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">
                User
              </Badge>
              <p>
                Can browse products, place orders, manage their cart and
                profile.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                Guest
              </Badge>
              <p>Can browse products only. Must log in to place orders.</p>
            </div>
          </div>
        </div>

        {/* Platform Info */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-gray-900">
              Platform Information
            </h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Platform</span>
              <span className="font-medium text-gray-900">
                GenMitra Photo Prints
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Backend</span>
              <span className="font-medium text-gray-900">
                Internet Computer (ICP)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Version</span>
              <span className="font-medium text-gray-900">1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
