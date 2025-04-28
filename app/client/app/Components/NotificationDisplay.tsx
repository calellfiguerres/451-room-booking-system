import React from "react";

interface NotificationDisplayProps {
    id: string;
    studentID: string;
    studentName: string;
    text: string;
    isNew?: boolean;
}

const NotificationDisplay: React.FC<NotificationDisplayProps> = ({ 
    id, 
    studentID, 
    studentName, 
    text,
    isNew = false 
}) => {
    return (
        <div className={`
            break-inside-avoid rounded-md 
            ${isNew ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-white'}
            transition-all duration-300
        `}>
            <div className="p-4 block space-y-2">
                <div className="flex justify-between items-center">
                    <p className="text-xl font-bold">
                        {studentName || 'System'}
                        {isNew && (
                            <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full animate-pulse">
                                New
                            </span>
                        )}
                    </p>
                </div>
                
                <p className="text-lg">
                    {text}
                </p>
                
                {studentID && (
                    <p className="text-sm text-gray-500">
                        ID: {studentID}
                    </p>
                )}
            </div>
        </div>
    );
};

export default NotificationDisplay;
