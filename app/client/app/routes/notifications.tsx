import React, { useEffect, useState } from "react";
import { api } from "~/.client/Providers/trpc";
import NotificationDisplay from "~/Components/NotificationDisplay";
import eventStore from "../services/eventService";

interface Notification {
  id: string;
  studentID: string;
  studentName: string;
  text: string;
  isNew?: boolean;
}

export default function Notifications() {
  // Get notifications from API
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Get real-time notifications
  const realtimeNotifications = eventStore.notifications;
  
  // Combine API and real-time notifications
  useEffect(() => {
    api.reservation.getNotifications.query().then((res) => {
      const apiNotifications = res.map((n) => ({
        id: n.notificationID,
        studentID: n.studentID,
        studentName: n.studentName,
        text: n.text,
        isNew: false
      }));
      
      // Add real-time notifications
      const newNotifications = realtimeNotifications.map(n => ({
        id: n.id || `temp-${Date.now()}`,
        studentID: '',
        studentName: 'System',
        text: n.content,
        isNew: true
      }));
      
      // Combine and sort by timestamp (newest first if available)
      setNotifications([...newNotifications, ...apiNotifications]);
    });
  }, [realtimeNotifications]);
  
  // Re-render component when eventStore state changes
  useEffect(() => {
    const handleStoreChange = () => {
      // Force component re-render
      setNotifications(prev => [...prev]);
    };
    
    // Subscribe to store changes
    const unsubscribe = (eventStore as any).on?.('stateChanged', handleStoreChange);
    
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);
  
  return (
    <div className='w-full pb-10 bg-black/10 height-minus-nav'>
      <div className='max-w-[1240px] py-8 px-2 mx-auto space-y-4'>
        <div className="rounded-md bg-white py-8 my-4">
          <p className='text-2xl text-center tracking-widest'>
            NOTIFICATIONS
          </p>
        </div>

        <div className='max-w-[1240px] py-8 px-16 mx-auto'>
          {notifications.length === 0 ? (
            <div className="rounded-md bg-white p-8 text-center">
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="mx-auto my-4 columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4">
              {notifications.map(n => (
                <NotificationDisplay
                  key={n.id}
                  id={n.id}
                  studentID={n.studentID}
                  studentName={n.studentName}
                  text={n.text}
                  isNew={n.isNew}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}