"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { Profile, UserRole } from "@/lib/supabase/types";
import { useToast } from "@/lib/context/ToastContext";
import { Users, Search, ShieldCheck, ChefHat, UserCheck, Shield } from "lucide-react";

export default function AdminUsersPage() {
  const { success } = useToast();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadProfiles() {
      const data = await store.getProfiles();
      setProfiles(data);
    }
    loadProfiles();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await store.updateProfileRole(userId, newRole);
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, role: newRole } : p))
    );
    success("Role Updated", `User role changed to ${newRole}`);
  };

  const filtered = profiles.filter(
    (p) =>
      p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white">
              User & Role Management
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Customer, seller, and administrator accounts registered on Home Plate.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search user name or email..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold bg-slate-900/80">
                  <th className="py-3.5 px-6">User</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Current Role</th>
                  <th className="py-3.5 px-6 text-right">Switch Role Permission</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                          {user.full_name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {user.full_name}
                          </p>
                          <p className="text-slate-400 text-[11px]">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-300">
                      {user.phone || "+91 98765 00000"}
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.role === "admin"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : user.role === "seller"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value as UserRole)
                        }
                        className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:border-purple-500"
                      >
                        <option value="customer">Customer</option>
                        <option value="seller">Home Cook (Seller)</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
