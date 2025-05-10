import React, { useEffect, useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { DollarSign, Users, TrendingUp, Utensils } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { groups } = useAppState();
  
  // Initial values
  const initialStats = {
    totalExpenses: 20000,
    totalMembers: 4,
    totalIncome: 35000,
    mostSpentCategory: { category: 'food', amount: 5000 }
  };

  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalMembers: 0,
    totalIncome: 0,
    mostSpentCategory: { category: initialStats.mostSpentCategory.category, amount: 0 }
  });

  useEffect(() => {
    const duration = 3000; // 3 seconds
    const steps = 100; // 100 steps for smoother animation
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      // Use easeOutQuad easing function for smoother animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      setStats({
        totalExpenses: Math.floor(initialStats.totalExpenses * easedProgress),
        totalMembers: Math.floor(initialStats.totalMembers * easedProgress),
        totalIncome: Math.floor(initialStats.totalIncome * easedProgress),
        mostSpentCategory: {
          category: initialStats.mostSpentCategory.category,
          amount: Math.floor(initialStats.mostSpentCategory.amount * easedProgress)
        }
      });
      
      if (currentStep === steps) {
        clearInterval(interval);
        setStats(initialStats);
      }
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, []); // Empty dependency array since we're using initialStats
  
  // Get recent expenses across all groups
  const recentExpenses = groups
    .flatMap(group => group.expenses.map(expense => ({ 
      ...expense, 
      groupName: group.name,
      createdByName: group.members.find(m => m.id === expense.createdBy)?.name || 'Unknown'
    })))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Members</h3>
            <Users className="h-8 w-8" />
          </div>
          <p className="text-4xl font-bold tracking-tight">{stats.totalMembers}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Expenses</h3>
            <DollarSign className="h-8 w-8" />
          </div>
          <p className="text-4xl font-bold tracking-tight">₹{stats.totalExpenses.toLocaleString('en-IN')}</p>
        </div>
        
        <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Total Income</h3>
            <TrendingUp className="h-8 w-8" />
          </div>
          <p className="text-4xl font-bold tracking-tight">₹{stats.totalIncome.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Most Spent On</h3>
            <Utensils className="h-8 w-8" />
          </div>
          <p className="text-2xl font-bold tracking-tight capitalize">{stats.mostSpentCategory.category}</p>
          <p className="text-3xl font-bold tracking-tight mt-2">₹{stats.mostSpentCategory.amount.toLocaleString('en-IN')}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-[#4c7f7f] mb-4">Recent Expenses</h2>
        {recentExpenses.length === 0 ? (
          <p className="text-gray-500">No recent expenses</p>
        ) : (
          <div className="space-y-4">
            {recentExpenses.map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <div>
                  <p className="font-medium text-gray-900">{expense.description}</p>
                  <p className="text-sm text-gray-500">
                    {expense.createdByName} • {expense.groupName}
                  </p>
                </div>
                <p className="text-lg font-semibold text-gray-900">₹{expense.amount.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;