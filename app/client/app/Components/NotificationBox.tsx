import React from "react";
import { Link } from "react-router-dom";
import eventStore from "../services/eventService";

interface NotificationBoxProps {
    link: string;
    text: string;
    image: string;
}

const NotificationBox: React.FC<NotificationBoxProps> = ({ link, text, image }) => {
    // Get notifications from event store
    const notifications = eventStore.notifications;
    
    // Count of notifications
    const count = notifications.length;
    
    // Check if there are new notifications (received in last 30 seconds)
    const hasNew = notifications.length > 0 && 
        notifications[0].timestamp && 
        (new Date().getTime() - new Date(notifications[0].timestamp).getTime() < 30000);
    
    return (
        <Link to={link}>
            <div className="
                relative
                px-4 py-4 bg-gray-300 rounded-xl 
                hover:bg-gradient-to-r from-[#02ced9] to-[#00a7b0]
                ease-in duration-150 hover:scale-[1.01]
                border border-[#d8d8d8] hover:border-[#d8d8d800] box
            ">
                <div className="m-auto">
                    <img src={image} alt="Notification" className="w-16 h-16 mx-auto" />
                    
                    {/* Notification count badge */}
                    {count > 0 && (
                        <div className={`
                            absolute top-1 right-1 
                            w-6 h-6 rounded-full text-white text-xs font-bold
                            flex items-center justify-center
                            ${hasNew ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}
                        `}>
                            {count}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default NotificationBox;