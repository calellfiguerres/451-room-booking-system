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
    <div className="w-full pb-10 bg-black/10 height-minus-nav">
      <div className="absolute top-5 right-5 flex items-center space-x-3 z-10">
        <Homebox homeLink="/" />
      </div>
      <div className="max-w-[1240px] py-8 px-2 mx-auto space-y-4">
        <div className="rounded-md bg-white py-8 px-4">
          <p className="text-2xl text-center tracking-widest">
            Applications
          </p>
        </div>
        <div className="flex justify-end mb-4">
          <a
            href="/applications"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            New Application
          </a>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {loading ? (
          <div className="text-center py-8">Fetching Applications...</div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-md p-8 text-center">
            <p className="text-gray-500">No Applications Found</p>
            <a
              href="/applications"
              className="mt-4 inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Create New Application
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-md p-6 shadow-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">{app.roomName}</h3>
                  <span className={`font-medium ${getStatusResponseColors(app.status)}`}>
                    {app.status.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600">Location: {app.roomLocation}</p>
                    <p className="text-gray-600">Requested: {dateView(app.requestDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Start Date: {dateView(app.startDate)}</p>
                    <p className="text-gray-600">End Date: {dateView(app.endDate)}</p>
                  </div>
                </div>
                {app.comments && (
                  <div className="mt-4 border-t pt-4">
                    <p className="text-gray-700 font-medium">Comments:</p>
                    <p className="text-gray-600">{app.comments}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}