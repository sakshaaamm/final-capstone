import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from './ExpenseTracker';
import { PieChart as PieChartIcon } from 'lucide-react';

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

const COLORS = [
  'hsl(210, 100%, 47%)',   // Primary blue
  'hsl(142, 71%, 45%)',    // Success green
  'hsl(0, 85%, 60%)',      // Destructive red
  'hsl(38, 92%, 50%)',     // Warning orange
  'hsl(271, 91%, 65%)',    // Purple
  'hsl(197, 71%, 52%)',    // Cyan
  'hsl(47, 96%, 53%)',     // Yellow
  'hsl(339, 90%, 51%)',    // Pink
];

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ transactions }) => {
  const categoryData = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    const categoryTotals = expenseTransactions.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border shadow-elegant rounded-lg p-3">
          <p className="font-medium">{data.category}</p>
          <p className="text-sm text-muted-foreground">
            ${data.amount.toLocaleString()} ({data.percentage.toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    if (percentage < 5) return null; // Don't show label for small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${percentage.toFixed(0)}%`}
      </text>
    );
  };

  if (categoryData.length === 0) {
    return (
      <Card className="p-6 bg-gradient-card shadow-card border-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold text-card-foreground">Expense Breakdown</h3>
          </div>
          <div className="flex items-center justify-center h-80">
            <p className="text-muted-foreground">No expense data available</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-card shadow-card border-0">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold text-card-foreground">Expense Breakdown</h3>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category List */}
        <div className="space-y-2">
          <h4 className="font-medium text-card-foreground">Categories</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {categoryData.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-card-foreground">{category.category}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">${category.amount.toLocaleString()}</div>
                  <div className="text-muted-foreground text-xs">
                    {category.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};