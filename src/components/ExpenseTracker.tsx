import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { TransactionList } from './TransactionList';
import { AddTransactionDialog } from './AddTransactionDialog';
import { ExpenseChart } from './ExpenseChart';
import { CategoryBreakdown } from './CategoryBreakdown';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
  date: Date;
}

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    amount: 3500,
    description: 'Monthly Salary',
    category: 'Salary',
    type: 'income',
    date: new Date(2024, 0, 1),
  },
  {
    id: '2',
    amount: 1200,
    description: 'Rent Payment',
    category: 'Housing',
    type: 'expense',
    date: new Date(2024, 0, 2),
  },
  {
    id: '3',
    amount: 350,
    description: 'Grocery Shopping',
    category: 'Food',
    type: 'expense',
    date: new Date(2024, 0, 3),
  },
  {
    id: '4',
    amount: 150,
    description: 'Freelance Project',
    category: 'Freelance',
    type: 'income',
    date: new Date(2024, 0, 4),
  },
  {
    id: '5',
    amount: 80,
    description: 'Gas Station',
    category: 'Transportation',
    type: 'expense',
    date: new Date(2024, 0, 5),
  },
];

export const ExpenseTracker: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = totalIncome - totalExpenses;

    return { totalIncome, totalExpenses, balance };
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Expense Tracker
            </h1>
            <p className="text-muted-foreground mt-2">
              Take control of your finances with detailed tracking and insights
            </p>
          </div>
          <Button 
            onClick={() => setIsDialogOpen(true)}
            size="lg"
            className="shadow-floating"
          >
            <Plus className="w-5 h-5" />
            Add Transaction
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-card shadow-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Balance</p>
                <p className={`text-3xl font-bold mt-1 ${
                  summary.balance >= 0 ? 'text-success' : 'text-destructive'
                }`}>
                  ${summary.balance.toLocaleString()}
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                summary.balance >= 0 ? 'bg-success/10' : 'bg-destructive/10'
              }`}>
                <DollarSign className={`w-6 h-6 ${
                  summary.balance >= 0 ? 'text-success' : 'text-destructive'
                }`} />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Income</p>
                <p className="text-3xl font-bold text-success mt-1">
                  ${summary.totalIncome.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-success/10">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Expenses</p>
                <p className="text-3xl font-bold text-destructive mt-1">
                  ${summary.totalExpenses.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-full bg-destructive/10">
                <TrendingDown className="w-6 h-6 text-destructive" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpenseChart transactions={transactions} />
          <CategoryBreakdown transactions={transactions} />
        </div>

        {/* Transactions */}
        <TransactionList 
          transactions={transactions} 
          onDelete={deleteTransaction}
        />

        {/* Add Transaction Dialog */}
        <AddTransactionDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onAdd={addTransaction}
        />
      </div>
    </div>
  );
};