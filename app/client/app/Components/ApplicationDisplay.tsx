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
  const getStatusResponseColors = (status: string) => {
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
    <div>
      
    </div>
  )
}