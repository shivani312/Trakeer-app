import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, Group, User, Expense } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Sample data
const mockUser: User = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  phoneNumber: '+1234567890',
};

const mockGroups: Group[] = [
  {
    id: 'group1',
    name: 'Family Budget',
    description: 'Track our family expenses and savings goals',
    createdBy: 'user1',
    createdAt: new Date().toISOString(),
    members: [
      mockUser,
      {
        id: 'user2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        phoneNumber: '+1987654321',
      }
    ],
    expenses: [
      {
        id: 'exp1',
        amount: 120.50,
        description: 'Grocery shopping',
        category: 'Food',
        date: new Date().toISOString(),
        createdBy: 'user1',
        groupId: 'group1',
      },
      {
        id: 'exp2',
        amount: 45.00,
        description: 'Gas',
        category: 'Transportation',
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        createdBy: 'user2',
        groupId: 'group1',
      }
    ],
    inviteCode: 'ABC123',
  },
  {
    id: 'group2',
    name: 'Trip to Paris',
    description: 'Expenses for our vacation in Paris',
    createdBy: 'user1',
    createdAt: new Date().toISOString(),
    members: [
      mockUser,
      {
        id: 'user3',
        name: 'Mike Smith',
        email: 'mike@example.com',
        phoneNumber: '+1122334455',
      }
    ],
    expenses: [],
    inviteCode: 'DEF456',
  }
];

// Initial state
const initialState: AppState = {
  currentUser: mockUser,
  groups: mockGroups,
  selectedGroup: null,
  notifications: [],
};

interface AppStateContextType extends AppState {
  createGroup: (name: string, description: string) => void;
  addMemberToGroup: (groupId: string, phoneNumber: string) => void;
  removeMemberFromGroup: (groupId: string, userId: string) => void;
  addExpenseToGroup: (groupId: string, expense: Omit<Expense, 'id' | 'groupId' | 'createdBy'>) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);
  
  // Create a new group
  const createGroup = (name: string, description: string) => {
    if (!state.currentUser) return;
    
    const newGroup: Group = {
      id: uuidv4(),
      name,
      description,
      createdBy: state.currentUser.id,
      createdAt: new Date().toISOString(),
      members: [state.currentUser],
      expenses: [],
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
    
    setState(prev => ({
      ...prev,
      groups: [...prev.groups, newGroup],
    }));
  };
  
  // Add a member to a group
  const addMemberToGroup = (groupId: string, phoneNumber: string) => {
    // In a real app, this would send a WhatsApp invite
    // For now, we'll simulate adding a new user
    
    const newUser: User = {
      id: uuidv4(),
      name: `User (${phoneNumber.slice(-4)})`,
      email: `user${Math.floor(Math.random() * 1000)}@example.com`,
      phoneNumber,
    };
    
    setState(prev => ({
      ...prev,
      groups: prev.groups.map(group => {
        if (group.id === groupId) {
          // Check if user with this phone already exists
          const memberExists = group.members.some(m => m.phoneNumber === phoneNumber);
          if (memberExists) return group;
          
          return {
            ...group,
            members: [...group.members, newUser],
          };
        }
        return group;
      }),
    }));
    
    // Add notification
    addNotification(`Invitation sent to ${phoneNumber} via WhatsApp`);
  };
  
  // Remove a member from a group
  const removeMemberFromGroup = (groupId: string, userId: string) => {
    setState(prev => ({
      ...prev,
      groups: prev.groups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            members: group.members.filter(member => member.id !== userId),
          };
        }
        return group;
      }),
    }));
    
    // Add notification
    addNotification('Member removed from group');
  };
  
  // Add an expense to a group
  const addExpenseToGroup = (groupId: string, expense: Omit<Expense, 'id' | 'groupId' | 'createdBy'>) => {
    if (!state.currentUser) return;
    
    const newExpense: Expense = {
      id: uuidv4(),
      ...expense,
      groupId,
      createdBy: state.currentUser.id,
    };
    
    setState(prev => ({
      ...prev,
      groups: prev.groups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            expenses: [...group.expenses, newExpense],
          };
        }
        return group;
      }),
    }));
    
    // Add notification
    addNotification(`Expense of $${expense.amount.toFixed(2)} added`);
  };
  
  // Add a notification
  const addNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'success') => {
    const newNotification = {
      id: uuidv4(),
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    setState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications.slice(0, 9)], // Keep only 10 latest
    }));
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.filter(n => n.id !== newNotification.id),
      }));
    }, 5000);
  };
  
  return (
    <AppStateContext.Provider
      value={{
        ...state,
        createGroup,
        addMemberToGroup,
        removeMemberFromGroup,
        addExpenseToGroup,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};