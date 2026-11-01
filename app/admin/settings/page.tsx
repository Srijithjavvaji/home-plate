"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { useToast } from "@/lib/context/ToastContext";
import { useAuth } from "@/lib/context/AuthContext";
import { CategoryCommission, AppSetting } from "@/lib/supabase/types";
import {
  Settings,
  Percent,
  Truck,
  IndianRupee,
  Save,
  CheckCircle2,
  MapPin,
  ShieldAlert,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { success, error: toastError } = useToast();
  const { user } = useAuth();

  const [commissions, setCommissions] = useState<CategoryCommission[]>([]);
  const [minOrderValue, setMinOrderValue] = useState<number>(149);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<number>(500);
  const [baseDeliveryFee, setBaseDeliveryFee] = useState<number>(40);
  const [taxPercentage, setTaxPercentage] = useState<number>(5.0);
  const [pincodes, setPincodes] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const commList = await store.getCategoryCommissions();
      setCommissions(commList);

      const mov = await store.getAppSetting("min_order_value", 149);
      setMinOrderValue(Number(mov));

      const fdt = await store.getAppSetting("free_delivery_threshold", 500);
      setFreeDeliveryThreshold(Number(fdt));

      const bdf = await store.getAppSetting("base_delivery_fee", 40);
      setBaseDeliveryFee(Number(bdf));

      const tax = await store.getAppSetting("tax_percentage", 5.0);
      setTaxPercentage(Number(tax));

      const pins = await store.getAppSetting("hyderabad_service_pincodes", [
        "500001", "500002", "500003", "500004", "500008", "500016", "500032", "500033", "500034", "500081", "500082", "500084", "500089", "500090"
      ]);
      setPincodes(Array.isArray(pins) ? pins.join(", ") : String(pins));
    }
    loadData();
  }, []);

  const handleCommissionChange = (categoryId: string, val: number) => {
    setCommissions((prev) =>
      prev.map((c) => (c.category_id === categoryId ? { ...c, commission_percentage: val } : c))
    );
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // 1. Save Category Commissions
      for (const comm of commissions) {
        await store.updateCategoryCommission(comm.category_id, comm.commission_percentage);
      }

      // 2. Save Business Settings
      await store.updateAppSetting("min_order_value", minOrderValue);
      await store.updateAppSetting("free_delivery_threshold", freeDeliveryThreshold);
      await store.updateAppSetting("base_delivery_fee", baseDeliveryFee);
      await store.updateAppSetting("tax_percentage", taxPercentage);

      const pinArray = pincodes
        .split(",")
        .map((p) => p.trim())
        .filter((p) => /^\d{6}$/.test(p));
      await store.updateAppSetting("hyderabad_service_pincodes", pinArray);

      // 3. Log Admin Action
      await store.logAdminAction(
        user?.id || "admin",
        "update_platform_settings",
        "platform_configuration",
        "global",
        null,
        {
          minOrderValue,
          freeDeliveryThreshold,
          baseDeliveryFee,
          taxPercentage,
          commissionsCount: commissions.length,
        }
      );

      success("Settings Saved!", "Platform business variables and category commissions updated.");
    } catch (err: any) {
      toastError("Failed to save", err?.message || "Check fields and retry");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 flex items-center gap-2">
          <Settings className="w-6 h-6 text-orange-600" />
          <span>Platform Commissions & Financial Settings</span>
        </h1>
        <p className="text-xs text-[#7c5946] mt-1">
          Configure category-specific platform commissions, Hyderabad delivery pricing, and minimum order rules.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Category-wise Commission Settings */}
        <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Percent className="w-5 h-5 text-orange-600" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Category-Wise Marketplace Commission
            </h2>
          </div>
          <p className="text-xs text-gray-500">
            Different commission percentages applied automatically upon successful delivery.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {commissions.map((comm) => (
              <div
                key={comm.category_id}
                className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100/80 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 truncate">
                    {comm.category?.name || comm.category_id.replace("cat-", "").replace("-", " ")}
                  </span>
                  <span className="text-xs font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full">
                    {comm.commission_percentage}%
                  </span>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#7c5946] block mb-1">
                    Commission Rate (%):
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={comm.commission_percentage}
                    onChange={(e) => handleCommissionChange(comm.category_id, parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-orange-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial & Delivery Thresholds */}
        <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Truck className="w-5 h-5 text-orange-600" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Order Rules & Delivery Logistics Pricing
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800">Minimum Order Value (₹)</label>
              <input
                type="number"
                min="0"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:bg-white focus:outline-none focus:border-orange-500"
              />
              <span className="text-[10px] text-gray-400">Enforced during cart checkout</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800">Free Delivery Threshold (₹)</label>
              <input
                type="number"
                min="0"
                value={freeDeliveryThreshold}
                onChange={(e) => setFreeDeliveryThreshold(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:bg-white focus:outline-none focus:border-orange-500"
              />
              <span className="text-[10px] text-gray-400">Orders above this get free shipping</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800">Standard Delivery Fee (₹)</label>
              <input
                type="number"
                min="0"
                value={baseDeliveryFee}
                onChange={(e) => setBaseDeliveryFee(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:bg-white focus:outline-none focus:border-orange-500"
              />
              <span className="text-[10px] text-gray-400">Base fee below free threshold</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800">Platform Tax / GST (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={taxPercentage}
                onChange={(e) => setTaxPercentage(parseFloat(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:bg-white focus:outline-none focus:border-orange-500"
              />
              <span className="text-[10px] text-gray-400">Food tax configuration</span>
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs font-bold text-gray-800 block mb-1">
              Active Hyderabad Service PIN Codes (Comma Separated)
            </label>
            <textarea
              rows={3}
              value={pincodes}
              onChange={(e) => setPincodes(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-mono focus:bg-white focus:outline-none focus:border-orange-500"
            />
            <span className="text-[10px] text-gray-400">Validated against pickup and drop addresses</span>
          </div>
        </div>

        {/* Save Changes CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? "Saving Settings..." : "Save Platform Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
