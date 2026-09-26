"use client";

import React, { useState } from "react";
import { X, Plus, Wallet, Calendar, Tag, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateExpenseInput } from "@/app/actions/expenses";
import { DEFAULT_EXPENSE_CATEGORIES } from "@/lib/constants/expenses";

interface CreateExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateExpenseInput) => Promise<void>;
}

export function CreateExpenseModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateExpenseModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categoryName, setCategoryName] = useState<string>(
    DEFAULT_EXPENSE_CATEGORIES[0]?.name ?? "Food & Dining"
  );
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }
    if (!description.trim()) {
      setError("Please enter an expense description");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const selectedCat = DEFAULT_EXPENSE_CATEGORIES.find(
        (c) => c.name === categoryName
      );
      await onSubmit({
        amount: numAmount,
        description: description.trim(),
        category_name: categoryName,
        category_color: selectedCat?.color || "#154D38",
        date,
        currency: "BDT",
      });

      setAmount("");
      setDescription("");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to log expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white border border-zinc-200 shadow-2xl p-6 sm:p-7 space-y-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#154D38]">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-zinc-900">
                Log New Expense
              </h2>
              <p className="text-xs text-zinc-500">
                Record expenditure in Bangladeshi Taka (৳ BDT)
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

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount in BDT */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1">
              <span>Amount (৳ BDT)</span>
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-500">
                ৳
              </span>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1450"
                className="w-full h-11 pl-8 pr-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-base font-bold text-zinc-900 focus:outline-none focus:border-[#154D38] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1">
              <FileText className="h-3.5 w-3.5 text-zinc-400" />
              <span>Description / Merchant</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Cloud Hosting, Grocery, Book Purchase"
              className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#154D38] focus:bg-white transition-colors"
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-zinc-400" />
              <span>Expense Category</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DEFAULT_EXPENSE_CATEGORIES.map((cat) => {
                const isSelected = categoryName === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setCategoryName(cat.name)}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all flex items-center gap-2 ${
                      isSelected
                        ? "bg-[#E8F5E9] text-[#154D38] border-[#154D38] shadow-2xs font-bold"
                        : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:border-zinc-300"
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-zinc-400" />
              <span>Transaction Date</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#154D38] focus:bg-white transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="gap-2 px-6 bg-[#154D38] hover:bg-[#0E3425] text-white shadow-xs text-xs font-bold"
            >
              <Plus className="h-4 w-4" />
              <span>{isSubmitting ? "Logging..." : "Log Expense"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
