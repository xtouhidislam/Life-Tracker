"use client";

import React, { useState } from "react";
import { ExpenseItem } from "@/app/actions/expenses";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Search, Trash2, ArrowUpRight, Filter, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionTableProps {
  expenses: ExpenseItem[];
  onDelete: (id: string) => Promise<void>;
}

export function TransactionTable({ expenses, onDelete }: TransactionTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Extract unique categories
  const categories = Array.from(new Set(expenses.map((e) => e.category_name)));

  // Filtered expenses
  const filtered = expenses.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || e.category_name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this expense record?")) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <Card className="bg-white border-zinc-200/90 shadow-2xs rounded-3xl">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-base font-bold text-zinc-900">
            Recent Expenditures
          </CardTitle>
          <CardDescription className="text-xs text-zinc-500">
            Granular breakdown of verified financial transactions
          </CardDescription>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search merchant or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-8 pr-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:outline-none focus:border-[#154D38] focus:bg-white transition-colors"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 px-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 focus:outline-none focus:border-[#154D38]"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        {filtered.length === 0 ? (
          <div className="py-12 text-center space-y-2 border border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
            <Receipt className="h-8 w-8 text-zinc-300 mx-auto" />
            <p className="text-xs font-bold text-zinc-600">
              No transactions match your search filter
            </p>
            <p className="text-[11px] text-zinc-400">
              Try adjusting your query or logging a new expense.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200/90 hover:bg-zinc-50/50 hover:shadow-2xs transition-all group"
            >
              {/* Left Details */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: `${item.category_color}15`,
                    borderColor: `${item.category_color}30`,
                    color: item.category_color,
                  }}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </div>

                <div className="min-w-0 space-y-0.5">
                  <div className="text-sm font-bold text-zinc-900 truncate">
                    {item.description}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
                    <span className="font-mono">{item.date}</span>
                    <span>•</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{
                        backgroundColor: `${item.category_color}15`,
                        color: item.category_color,
                      }}
                    >
                      {item.category_name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Amount & Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className="text-sm sm:text-base font-bold font-sans text-zinc-900">
                    - ৳ {item.amount.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-400">
                    {item.currency}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                  title="Delete expense"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
