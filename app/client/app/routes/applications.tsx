import { useEffect, useState } from "react";
import { api } from "~/.client/Providers/trpc";
import HomeBox from "~/Components/HomeBox";
import { useNavigate } from "react-router";

/**
 * Primary function for the application form page.
 */
export default function ApplicationForm() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch available rooms on component mount
  useEffect(() => {
    api.rooms.getAllRooms.query().then((fetchedRooms) => {
      setRooms(fetchedRooms);
    }).catch(err => {
      setError("Failed to fetch rooms.");
      console.error(err);
    });
  }, []);

  /**
   * Application submission handler.
   * @param e The form submission event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!selectedRoomId) {
      setError("Select a Room.");
      return;
    }
    if (!startDate || !endDate) {
      setError("Select Start and End Dates.");
      return;
    }
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    if (endDateObj <= startDateObj) {
      setError("End date must be after start date.");
      return;
    }
    try {
      // application reset
      await api.application.submit.mutate({
        roomId: selectedRoomId,
        startDate: startDateObj,
        endDate: endDateObj,
        comments: comments
      });
      setSuccess(true);
      setSelectedRoomId("");
      setStartDate("");
      setEndDate("");
      setComments("");
      // directs user to view applications page
      setTimeout(() => {
        navigate("/applications");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to submit application.");
      console.error(err);
    }
  };

  return (
    <div className="w-full pb-10 bg-black/10 height-minus-nav">
      <div className="absolute top-5 right-5 flex items-center space-x-3 z-10">
        <HomeBox homeLink="/" />
      </div>
      <div className="max-w-[1240px] py-8 px-2 mx-auto space-y-4">
        <div className="rounded-md bg-white py-8 my-4">
          <p className="text-2xl text-center tracking-widest">
            Dormitory Room Application
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span  className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">Application Submitted!</span>
          </div>
        )}
        <div className="big-white rounded-md p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="roomSelect" className="block text-gray-700 text-sm font-bold mb-2">
                Select Room:
              </label>
              <select
                id="roomSelect"
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
                className="shadow appearance-none broder rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">-- Select a Room --</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} - {room.location}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="startDate" className="block text-gray-700 text-sm font-bold mb-2">
                Start Date:
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="shadow appearance-none broder rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="endDate" className="block text-gray-700 text-sm font-bold mb-2">
                End Date:
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="shadow appearance-none broder rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="comments" className="block text-gray-700 text-sm font-bold mb-2">
                Comments:
              </label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="shadow appearance-none broder rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={4}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}