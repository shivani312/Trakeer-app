import React from 'react';
import GroupList from '../components/Groups/GroupList';
import { useAppState } from '../context/AppStateContext';

const GroupsPage: React.FC = () => {
  const { groups } = useAppState();
  
  return <GroupList groups={groups} />;
};

export default GroupsPage;