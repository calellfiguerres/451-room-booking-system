import React from "react";

const MaintenanceRequestDisplay: React.FC<{    
    id: string,
    roomId: string,
    description: string,
    openDate: string,
    closeDate: string | null,
    status: string
}> = ({ id, roomId, description, openDate, closeDate, status }) => {
    
    // helper function to get status style
    const getStatusClass = () => {
        switch (status) {
            case 'open':
                return 'text-red-500';
            case 'in-progress':
                return 'text-yellow-500';
            case 'closed':
                return 'text-green-500';
            default:
                return 'text-gray-500';
        }
    };
    
    // format the date for display
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString();
    };
    
    return (
        <div className="break-inside-avoid rounded-md bg-white">
            <div className="p-4 block space-x-4 flex justify-between items-center preview-button">
                <p className="text-lg">
                    Room: {roomId}
                </p>
                
                <p className="text-lg">
                    {description.length > 30 ? description.substring(0, 30) + "..." : description}
                </p>
                
                <p className={`text-lg font-medium ${getStatusClass()}`}>
                    {status.toUpperCase()}
                </p>
            </div>
            
            <div className="px-4 pb-3 text-sm text-gray-500">
                Opened: {formatDate(openDate)}
                {closeDate && ` • Closed: ${formatDate(closeDate)}`}
            </div>
        </div>
    );
};

export default MaintenanceRequestDisplay;
