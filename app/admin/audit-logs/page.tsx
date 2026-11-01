"use client";

import React, { useState, useEffect } from "react";
import { store } from "@/lib/data/store";
import { AdminAuditLog } from "@/lib/supabase/types";
import { History, ShieldCheck, User, Calendar, Database } from "lucide-react";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);

  useEffect(() => {
    async function loadLogs() {
      const list = await store.getAdminAuditLogs();
      setLogs(list);
    }
    loadLogs();
  }, []);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-950 flex items-center gap-2">
          <History className="w-6 h-6 text-orange-600" />
          <span>Administrative Audit Trail</span>
        </h1>
        <p className="text-xs text-[#7c5946] mt-1">
          Immutable system log of all sensitive administrative actions, commission adjustments, and seller approvals.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100">
          {logs.length === 0 ? (
            <div className="p-12 text-center text-xs text-gray-400">
              No audit records logged yet.
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg font-mono">
                      {log.action}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
                      {log.entity_type}
                    </span>
                  </div>
                  <p className="text-gray-500 font-mono text-[11px]">
                    Entity ID: {log.entity_id}
                  </p>
                  {log.new_data && (
                    <div className="mt-1 p-2 rounded-lg bg-gray-50 text-gray-700 font-mono text-[10px] max-w-xl truncate">
                      {JSON.stringify(log.new_data)}
                    </div>
                  )}
                </div>

                <div className="text-right text-[11px] text-gray-400 shrink-0">
                  <div className="flex items-center gap-1 font-semibold text-gray-700 justify-end">
                    <User className="w-3.5 h-3.5 text-orange-600" />
                    <span>{log.actor?.full_name || "System Admin"}</span>
                  </div>
                  <span>{new Date(log.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
