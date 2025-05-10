import React, { createContext, useContext, useState } from 'react';
import { AppState, Group } from '../types';

import HttpService from '../services/httpService';

interface FamilyMember {
  id: string;
  name: string;
  email?: string;
  phoneNumber: string;
}

interface FamilyMembersResponse {
  data: FamilyMember[];
  message?: string;
}

// Sample data
// const mockUser: User = {
//   id: 'user1',
//   name: 'John Doe',
//   email: 'john@example.com',
//   phoneNumber: '+1234567890',
// };

const mockGroups: Group[] = [
  {
    id: 'group1',
    name: 'Family Budget',
    description: 'Track our family expenses and savings goals',
    createdBy: 'user1',
    createdAt: new Date().toISOString(),
    members: [
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
  groups: mockGroups,
  selectedGroup: null,
  notifications: [],
};

interface AppStateContextType extends AppState {
  createGroup: (name: string, description: string) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);
  
  // Create a new group
  const createGroup = async () => {
    try {
      const response = await HttpService.get<FamilyMembersResponse>('/family/members', {}, { isAccessTokenRequire: true });
      
      if (response && response.data) {
        setState(prev => ({
          ...prev,
          groups: [...prev.groups],
        }));
      }
    } catch (error) {
      console.error('Failed to fetch family members:', error);
    }
  };

  return (
    <AppStateContext.Provider
      value={{
        ...state,
        createGroup,
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