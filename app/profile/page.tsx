"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { User, Mail, Phone, MapPin, Plus, Trash2, ShieldCheck, Home } from "lucide-react";

interface SavedAddress {
  id: string;
  label: string;
  name: string;
  phone: string;
  addressLine1: string;
  city: string;
  pincode: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { success } = useToast();

  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: "addr_1",
      label: "Home",
      name: user?.full_name || "Rahul Sharma",
      phone: user?.phone || "+91 98765 22001",
      addressLine1: "Flat 401, Sapphire Heights, Hitec City",
      city: "Hyderabad",
      pincode: "500081",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState("Home");
  const [newName, setNewName] = useState(user?.full_name || "");
  const [newPhone, setNewPhone] = useState(user?.phone || "");
  const [newLine1, setNewLine1] = useState("");
  const [newCity, setNewCity] = useState("Hyderabad");
  const [newPincode, setNewPincode] = useState("");

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: SavedAddress = {
      id: `addr_${Date.now()}`,
      label: newLabel,
      name: newName,
      phone: newPhone,
      addressLine1: newLine1,
      city: newCity,
      pincode: newPincode,
    };
    setAddresses((prev) => [...prev, newAddr]);
    setIsModalOpen(false);
    success("Address Saved", "New delivery address has been saved.");
    setNewLine1("");
    setNewPincode("");
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    success("Address Removed");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
            Account Profile & Addresses
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your personal profile and saved delivery locations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* User Profile Card */}
          <div className="md:col-span-5 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-600/30">
                {user?.full_name?.charAt(0) || "U"}
              </div>
              <h2 className="text-lg font-bold text-gray-900">{user?.full_name}</h2>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-800">
                {user?.role} Account
              </span>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{user?.phone || "+91 98765 22001"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Home Plate Member</span>
              </div>
            </div>
          </div>

          {/* Saved Addresses Section */}
          <div className="md:col-span-7 bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Saved Delivery Addresses
                </h3>
                <p className="text-xs text-gray-500">
                  Quick select during checkout
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Address
              </Button>
            </div>

            {/* Address List */}
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white text-emerald-700 shadow-xs border border-gray-100 mt-0.5">
                      <Home className="w-4 h-4" />
                    </div>
                    <div className="text-xs space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{addr.label}</span>
                        <span className="text-[11px] text-gray-400">({addr.name})</span>
                      </div>
                      <p className="text-gray-600">{addr.addressLine1}</p>
                      <p className="text-gray-500">{addr.city} - {addr.pincode}</p>
                      <p className="text-gray-400 text-[11px]">Phone: {addr.phone}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-gray-400 hover:text-rose-600 transition p-1"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Address Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Delivery Address"
          description="Enter your complete home or work address details"
        >
          <form onSubmit={handleAddAddress} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Label (e.g. Home, Work)"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                required
              />
              <Input
                label="Contact Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <Input
              label="Contact Phone"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              required
            />
            <Input
              label="Address Line"
              placeholder="Flat 102, Green Valley Apartments"
              value={newLine1}
              onChange={(e) => setNewLine1(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="City"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                required
              />
              <Input
                label="Pincode"
                placeholder="500081"
                value={newPincode}
                onChange={(e) => setNewPincode(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full py-3 mt-2">
              Save Delivery Address
            </Button>
          </form>
        </Modal>
      </div>
    </div>
  );
}
