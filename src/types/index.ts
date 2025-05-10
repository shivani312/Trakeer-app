export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  avatar?: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  createdBy: string;
  groupId: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  members: User[];
  expenses: Expense[];
  inviteCode: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface AppState {
  currentUser: User | null;
  groups: Group[];
  selectedGroup: Group | null;
  notifications: Notification[];
}