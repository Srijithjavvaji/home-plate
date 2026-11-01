"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { useToast } from "@/lib/context/ToastContext";
import { useAuth } from "@/lib/context/AuthContext";
import { Complaint, ComplaintStatus } from "@/lib/supabase/types";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw,
  XCircle,
  MessageSquare,
  Search,
  Filter,
} from "lucide-react";

export default function AdminComplaintsPage() {
  const { success, error: toastError } = useToast();
  const { user } = useAuth();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function loadComplaints() {
      const list = await store.getComplaints();
      setComplaints(list);
    }
    loadComplaints();
  }, []);

  const handleUpdateStatus = async (status: ComplaintStatus) => {
    if (!selectedComplaint) return;
    setIsProcessing(true);
    try {
      await store.updateComplaintStatus(
        selectedComplaint.id,
        status,
        resolutionNotes,
        user?.id || "admin"
      );

      // If approved refund, automatically create a refund record
      if (status === "approved_refund" && selectedComplaint.order) {
        await store.createRefund({
          order_id: selectedComplaint.order_id,
          complaint_id: selectedComplaint.id,
          amount: selectedComplaint.order.total_amount,
          reason: `Complaint ${selectedComplaint.ticket_number}: ${selectedComplaint.category}`,
          status: "approved",
          reviewed_by: user?.id || "admin",
          updated_at: new Date().toISOString(),
        });
      }

      await store.logAdminAction(
        user?.id || "admin",
        `complaint_${status}`,
        "complaint",
        selectedComplaint.id,
        { previous_status: selectedComplaint.status },
        { status, resolutionNotes }
      );

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === selectedComplaint.id
            ? { ...c, status, resolution_notes: resolutionNotes }
            : c
        )
      );

      success("Status Updated", `Complaint marked as ${status.replace(/_/g, " ")}`);
      setSelectedComplaint(null);
      setResolutionNotes("");
    } catch (err: any) {
      toastError("Failed", err?.message || "Error updating dispute");
    } finally {
      setIsProcessing(false);
    }
  };

  const filtered = complaints.filter((c) => {
    if (filterStatus === "all") return true;
    return c.status === filterStatus;
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-orange-600" />
          <span>Disputes & Customer Support Desk</span>
        </h1>
        <p className="text-xs text-[#7c5946] mt-1">
          Review customer food quality, damaged packaging, or delivery complaints with full audit logging.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        {["all", "open", "under_investigation", "approved_refund", "resolved", "rejected"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
              filterStatus === st
                ? "bg-orange-600 text-white shadow-xs"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {st.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400">
              No disputes found in this category.
            </div>
          ) : (
            filtered.map((comp) => (
              <div key={comp.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">{comp.ticket_number}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                      {comp.category.replace(/_/g, " ")}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        comp.status === "resolved"
                          ? "bg-emerald-100 text-emerald-800"
                          : comp.status === "approved_refund"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {comp.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed max-w-2xl">{comp.description}</p>
                  <div className="flex items-center gap-4 text-[11px] text-gray-400">
                    <span>Order: #{comp.order?.order_number || comp.order_id}</span>
                    {comp.seller && <span>Kitchen: {comp.seller.kitchen_name}</span>}
                    <span>Reported: {new Date(comp.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedComplaint(comp);
                    setResolutionNotes(comp.resolution_notes || "");
                  }}
                  className="px-4 py-2 rounded-xl border border-orange-200 text-orange-700 hover:bg-orange-50 font-bold text-xs transition shrink-0"
                >
                  Inspect & Resolve
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Resolution Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-950">
                  Resolve Dispute {selectedComplaint.ticket_number}
                </h3>
                <p className="text-xs text-gray-500">
                  Category: {selectedComplaint.category.replace(/_/g, " ")}
                </p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 bg-orange-50/70 rounded-2xl border border-orange-100 text-xs text-gray-700">
              <strong className="block text-gray-900 mb-1">Complainant Statement:</strong>
              {selectedComplaint.description}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800">Resolution / Audit Notes:</label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Enter actions taken, investigation findings, or reason..."
                className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleUpdateStatus("approved_refund")}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs text-center transition"
              >
                Approve Refund
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleUpdateStatus("resolved")}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs text-center transition"
              >
                Resolve
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleUpdateStatus("rejected")}
                className="p-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs text-center transition"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
