export type BudgetImpact = 'positive' | 'negative' | 'neutral';
export type EntryStatus = 'prevu' | 'recu' | 'annule' | 'realise';
export type PurchaseStatus = 'prevu' | 'possible' | 'risque' | 'realise' | 'reporte';

export type BudgetColumn = {
  id: string;
  name: string;
  type: 'income' | 'expense' | 'saving' | 'planned_purchase' | 'custom';
  impact: BudgetImpact;
  position: number;
  isDefault: boolean;
};

export type BudgetEntry = {
  id: string;
  month: number;
  columnId: string;
  name: string;
  amount: number;
  category: string;
  recurrence: 'none' | 'monthly' | 'yearly';
  status: EntryStatus;
  note?: string;
};

export type PlannedPurchase = {
  id: string;
  name: string;
  amount: number;
  desiredMonth: number;
  priority: 'basse' | 'moyenne' | 'haute';
  status: PurchaseStatus;
};

export type MonthlySummary = {
  month: number;
  income: number;
  expenses: number;
  savings: number;
  balance: number;
  annualBalance: number;
  cumulativeBalance: number;
};

export const monthNames = [
  'Jan',
  'Fev',
  'Mar',
  'Avr',
  'Mai',
  'Juin',
  'Juil',
  'Aout',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const budgetColumns: BudgetColumn[] = [
  { id: 'salary', name: 'Salaire pro', type: 'income', impact: 'positive', position: 1, isDefault: true },
  { id: 'passive', name: 'Revenus passifs', type: 'income', impact: 'positive', position: 2, isDefault: true },
  { id: 'fixed', name: 'Depenses fixes', type: 'expense', impact: 'negative', position: 3, isDefault: true },
  { id: 'variable', name: 'Depenses variables', type: 'expense', impact: 'negative', position: 4, isDefault: true },
  { id: 'surprise', name: 'Surprises', type: 'expense', impact: 'negative', position: 5, isDefault: true },
  { id: 'savings', name: 'Epargne prevue', type: 'saving', impact: 'neutral', position: 6, isDefault: true },
  { id: 'freelance', name: 'Mission freelance', type: 'custom', impact: 'positive', position: 7, isDefault: false },
  { id: 'transport', name: 'Transport', type: 'custom', impact: 'negative', position: 8, isDefault: false },
];

export const initialEntries: BudgetEntry[] = [
  { id: 'jan-salary', month: 0, columnId: 'salary', name: 'Salaire principal', amount: 650000, category: 'Travail', recurrence: 'monthly', status: 'recu' },
  { id: 'jan-passive', month: 0, columnId: 'passive', name: 'Petit business', amount: 85000, category: 'Business', recurrence: 'monthly', status: 'recu' },
  { id: 'jan-fixed', month: 0, columnId: 'fixed', name: 'Loyer et factures', amount: 255000, category: 'Maison', recurrence: 'monthly', status: 'realise' },
  { id: 'jan-variable', month: 0, columnId: 'variable', name: 'Vie quotidienne', amount: 185000, category: 'Quotidien', recurrence: 'monthly', status: 'realise' },
  { id: 'jan-savings', month: 0, columnId: 'savings', name: 'Objectif securite', amount: 120000, category: 'Epargne', recurrence: 'monthly', status: 'prevu' },
  { id: 'feb-freelance', month: 1, columnId: 'freelance', name: 'Mission logo', amount: 110000, category: 'Freelance', recurrence: 'none', status: 'recu' },
  { id: 'feb-transport', month: 1, columnId: 'transport', name: 'Transport mensuel', amount: 45000, category: 'Mobilite', recurrence: 'monthly', status: 'realise' },
  { id: 'mar-surprise', month: 2, columnId: 'surprise', name: 'Reparation moto', amount: 25000, category: 'Urgence', recurrence: 'none', status: 'prevu' },
];

export const plannedPurchases: PlannedPurchase[] = [
  { id: 'laptop', name: 'Ordinateur freelance', amount: 800000, desiredMonth: 8, priority: 'haute', status: 'possible' },
  { id: 'phone', name: 'Telephone', amount: 300000, desiredMonth: 7, priority: 'moyenne', status: 'risque' },
  { id: 'trip', name: 'Voyage decembre', amount: 550000, desiredMonth: 11, priority: 'basse', status: 'prevu' },
];

export function formatMoney(amount: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildMonthlySummaries(entries: BudgetEntry[], columns: BudgetColumn[]) {
  const columnMap = new Map(columns.map((column) => [column.id, column]));
  let annualBalance = 0;
  let cumulativeBalance = 0;

  return monthNames.map((_, month) => {
    const monthEntries = entries.filter((entry) => entry.month === month || entry.recurrence === 'monthly');
    const income = monthEntries.reduce((total, entry) => {
      const column = columnMap.get(entry.columnId);
      return column?.impact === 'positive' ? total + entry.amount : total;
    }, 0);
    const expenses = monthEntries.reduce((total, entry) => {
      const column = columnMap.get(entry.columnId);
      return column?.impact === 'negative' ? total + entry.amount : total;
    }, 0);
    const plannedSavings = monthEntries.reduce((total, entry) => {
      const column = columnMap.get(entry.columnId);
      return column?.type === 'saving' ? total + entry.amount : total;
    }, 0);
    const balance = income - expenses;

    annualBalance += balance;
    cumulativeBalance += balance;

    return {
      month,
      income,
      expenses,
      savings: Math.max(Math.min(plannedSavings, balance), 0),
      balance,
      annualBalance,
      cumulativeBalance,
    };
  });
}

export function getPurchaseAdvice(purchase: PlannedPurchase, summaries: MonthlySummary[]) {
  const securityFloor = 150000;
  const possibleMonth = summaries.find(
    (summary) => summary.cumulativeBalance - purchase.amount >= securityFloor,
  );
  const recommendedMonth = possibleMonth?.month ?? 11;
  const monthsLeft = Math.max(recommendedMonth + 1, 1);
  const monthlySaving = Math.ceil(purchase.amount / monthsLeft / 5000) * 5000;
  const desiredSummary = summaries[purchase.desiredMonth];
  const remainingAtDesired = desiredSummary.cumulativeBalance - purchase.amount;
  const isRisky = remainingAtDesired < securityFloor;

  return {
    recommendedMonth,
    monthlySaving,
    risk: isRisky ? 'risque' : 'maitrise',
    message: isRisky
      ? `Mieux vaut viser ${monthNames[recommendedMonth]} pour garder au moins ${formatMoney(securityFloor)} de marge.`
      : `${monthNames[purchase.desiredMonth]} reste possible avec une marge de securite suffisante.`,
  };
}
