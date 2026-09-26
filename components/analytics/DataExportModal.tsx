"use client";

import React, { useState } from "react";
import { X, Download, FileJson, FileSpreadsheet, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportLifeDataAction } from "@/app/actions/analytics";

interface DataExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DataExportModal({ isOpen, onClose }: DataExportModalProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async (format: "json" | "csv") => {
    setIsExporting(true);
    setDownloadSuccess(null);

    try {
      const res = await exportLifeDataAction(format);
      if (res.success) {
        // Trigger browser download
        const blob = new Blob([res.content], {
          type: format === "json" ? "application/json" : "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", res.filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setDownloadSuccess(`Downloaded ${res.filename} successfully.`);
        setTimeout(() => {
          setDownloadSuccess(null);
          onClose();
        }, 2500);
      }
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 sm:p-7 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#154D38]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-900">
                Data Sovereignty & Export
              </h2>
              <p className="text-xs text-zinc-500">
                Download your complete life tracker dataset
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-[#154D38]">
            <CheckCircle2 className="h-4 w-4 text-[#154D38] shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-xs text-zinc-600 leading-relaxed">
            LifeQuest is built with strict privacy and data ownership in mind. You can download an immutable offline copy of your tasks, habits, focus intervals, and expenses at any time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* JSON Export */}
            <button
              onClick={() => handleExport("json")}
              disabled={isExporting}
              className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-[#154D38] hover:bg-emerald-50/40 transition-all text-left space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <FileJson className="h-5 w-5 text-indigo-600" />
                <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">JSON</span>
              </div>
              <div className="text-xs font-bold text-zinc-900 group-hover:text-[#154D38]">
                Full JSON Backup
              </div>
              <div className="text-[10px] text-zinc-500">
                Raw database schema snapshot for storage or migration
              </div>
            </button>

            {/* CSV Export */}
            <button
              onClick={() => handleExport("csv")}
              disabled={isExporting}
              className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 hover:border-[#154D38] hover:bg-emerald-50/40 transition-all text-left space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
                <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">CSV</span>
              </div>
              <div className="text-xs font-bold text-zinc-900 group-hover:text-[#154D38]">
                Tasks & Deliverables
              </div>
              <div className="text-[10px] text-zinc-500">
                Spreadsheet format ready for Excel or Google Sheets
              </div>
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-zinc-100 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs border-zinc-200 text-zinc-600 hover:bg-zinc-50"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
