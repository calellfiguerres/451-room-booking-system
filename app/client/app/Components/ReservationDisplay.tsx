import React from "react";

/**
 * Initializing attributes
 */
interface ReservationDisplayProps {
    reservationID: number;
    roomName: string;
    roomLocation: string;
    openDate: Date;
    closeDate: Date;
    isActive: boolean;
}

const ReservationDisplay: React.FC<ReservationDisplayProps> = ({
    reservationID,
    roomName,
    roomLocation,
    openDate,
    closeDate,
    isActive
}) => {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    return (
        <div className="break-inside-avoid rounded-md bg-white mb-4">
            <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold">{roomName}</h3>
                    {isActive && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px=2.5 py-0.5 rounded">
                            Current Reservation
                        </span>
                    )}
                </div>
                <p className="text-gray-600">Location: {roomLocation}</p>
                <div className="flex justify-between text-sm text-gray-500">
                    <span>From: {formatDate(openDate)}</span>
                    <span>To: {formatDate(closeDate)}</span>
                </div>
                <p className="text-xs text-gray-400">Reservation ID: {reservationID}</p>
            </div>
        </div>
    );
};

export default ReservationDisplay;