import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppStateProvider } from './context/AppStateContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard';
import GroupsPage from './pages/GroupsPage';
import GroupPage from './pages/GroupPage';
import CreateGroupPage from './pages/CreateGroupPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import OTPVerificationPage from './pages/OTPVerificationPage';
import NotificationContainer from './components/Notification/NotificationContainer';

function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/verify-otp" element={<OTPVerificationPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path="groups" element={<GroupsPage />} />
              <Route path="groups/new" element={<CreateGroupPage />} />
              <Route path="groups/:groupId" element={<GroupPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <NotificationContainer />
        </Router>
      </AppStateProvider>
    </AuthProvider>
  );
}

export default App;