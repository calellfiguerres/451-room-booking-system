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