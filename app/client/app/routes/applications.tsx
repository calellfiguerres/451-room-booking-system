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
    <div>
    </div>
  );
}