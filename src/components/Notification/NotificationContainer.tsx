import React from 'react';
import { useAppState } from '../../context/AppStateContext';
import NotificationToast from './NotificationToast';

const NotificationContainer: React.FC = () => {
  const { notifications } = useAppState();
  
  const handleClose = (id: string) => {
    // This would be handled by the context in a real app
    console.log('Closing notification:', id);
  };
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-4 z-50">
      {notifications.map(notification => (
        <NotificationToast 
          key={notification.id} 
          notification={notification} 
          onClose={handleClose} 
        />
      ))}
    </div>
  );
};

export default NotificationContainer;