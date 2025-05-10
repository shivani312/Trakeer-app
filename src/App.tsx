import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppStateProvider } from './context/AppStateContext';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard';
import GroupsPage from './pages/GroupsPage';
import GroupPage from './pages/GroupPage';
import CreateGroupPage from './pages/CreateGroupPage';
import NotFoundPage from './pages/NotFoundPage';
import NotificationContainer from './components/Notification/NotificationContainer';

function App() {
  return (
    <AppStateProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="groups" element={<GroupsPage />} />
            <Route path="groups/new" element={<CreateGroupPage />} />
            <Route path="groups/:groupId" element={<GroupPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      <NotificationContainer />
    </AppStateProvider>
  );
}

export default App;