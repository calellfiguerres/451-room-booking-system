import React from "react";

/**
 * Interface for the application display component.
 */
interface ApplicationDisplayProps {
  id: string;
  roomName: string;
  roomLocation: string;
  requestDate: Date;
  startDate: Date;
  endDate: Date;
  status: string;
  comments?: string;
}

const ApplicationDisplay: React.FC<ApplicationDisplayProps> = ({
  id,
  roomName,
  roomLocation,
  requestDate,
  startDate,
  endDate,
  status,
  comments
}) => {
  
  /**
   * Provides the user with a standard format for the date.
   * @param date date for application submission and leasing.
   * @returns the date in a standard format.
   */
  const dateView = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Retrieves the colors for the status of the application.
   * @param status the status of the application.
   * @returns the color depending the status of the application.
   */
  const getStatusResponseColors = () => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
    }
  };

  return (
    <div className="break-inside-avoid rounded-md bg-white mb-4">
      <div className="p-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">{roomName}</h3>
          <span className={`font-medium ${getStatusResponseColors()}`}>
            {status.toUpperCase()}
          </span>
        </div>
        <p className="text-gray-600">Location: {roomLocation}</p>
        <p className="text-gray-600">Request Date: {dateView(requestDate)}</p>
        <div className="flex justify-between text-sm text-gray-500">
          <span>From: {dateView(startDate)}</span>
          <span>To: {dateView(endDate)}</span>
        </div>
        {comments && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-700">{comments}</p>
          </div>
        )}
        <p className="text-xs text-gray-400">Application ID: {id}</p>
      </div>
    </div>
  );
};

export default ApplicationDisplay;