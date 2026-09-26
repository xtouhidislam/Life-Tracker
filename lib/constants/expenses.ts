export interface ExpenseCategoryDef {
  name: string;
  color: string;
  default_budget: number;
}

export const DEFAULT_EXPENSE_CATEGORIES: ExpenseCategoryDef[] = [
  { name: "Food & Dining", color: "#10B981", default_budget: 12000 },
  { name: "Education & Tech Tools", color: "#154D38", default_budget: 8000 },
  { name: "Transport & Fuel", color: "#0D9488", default_budget: 6000 },
  { name: "Bills & Utilities", color: "#F59E0B", default_budget: 10000 },
  { name: "Personal & Health", color: "#6366F1", default_budget: 14000 },
];
