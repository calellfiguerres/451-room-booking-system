import { useEffect, useState } from "react";
import { api } from "~/.client/Providers/trpc";
import Homebox from "~/Components/HomeBox";
import Box from "~/Components/Box";

/**
 * Interface for the application component.
 */
interface ViewApplication {
  id: string;
  roomId: string;
  roomName: string;
  roomLocation: string;
  requestDate: Date;
  startDate: Date;
  endDate: Date;
  status: string;
  comments: string;
}

/**
 * Primary function for the application form page.
 */
export default function ViewApplications() {
  const [applications, setApplications] = useState<ViewApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch applications on component mount
  useEffect(() => {
    setLoading(true);
    api.application.getApplications.query()
      .then((fetchedApplications) => {
        setApplications(fetchedApplications);
        setError("");
      })
      .catch(err => {
        setError("Failed to fetch applications.");
        console.error(err);
        setLoading(false);
      });
  }, []);

  /**
   * Provides the user with a standard format for the date.
   * @param date date for application submission and leasing.
   * @returns the date in a standard format.
   */
  const dateView = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
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