import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAppState } from '../context/AppStateContext';
import GroupDetail from '../components/Groups/GroupDetail';
import { Expense } from '../types';

const GroupPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { groups, addMemberToGroup, removeMemberFromGroup, addExpenseToGroup } = useAppState();
  
  const group = groups.find(g => g.id === groupId);
  
  if (!group) {
    return <Navigate to="/groups" />;
  }
  
  const handleAddMember = (phoneNumber: string) => {
    if (groupId) {
      addMemberToGroup(groupId, phoneNumber);
    }
  };
  
  const handleRemoveMember = (userId: string) => {
    if (groupId) {
      removeMemberFromGroup(groupId, userId);
    }
  };
  
  const handleAddExpense = (expense: Omit<Expense, 'id' | 'groupId' | 'createdBy'>) => {
    if (groupId) {
      addExpenseToGroup(groupId, expense);
    }
  };
  
  return (
    <GroupDetail
      group={group}
      onAddMember={handleAddMember}
      onRemoveMember={handleRemoveMember}
      onAddExpense={handleAddExpense}
    />
  );
};

export default GroupPage;