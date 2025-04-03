import React, { useEffect, useState } from "react";
import { api } from "~/.client/Providers/trpc";
import { useNavigate } from "react-router";
import type { Room } from "../../../server/src/Models/Room";

const ReservationApplication: React.FC = () => {

    const [rooms, setRooms] = useState<Room[]>([]);
    const [selectedRoomId, setSelectedRoomId] = useState("");
    const [openDate, setOpenDate] = useState<string>("");
    const [closeDate, setCloseDate] = useState<string>("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const nav = useNavigate();

    useEffect(() => {
        setLoading(true);
        (api.rooms as any).getAllRooms.query().then((fetchedRooms: Room[]) => {
            setRooms(fetchedRooms);
            setLoading(false);
        }).catch((err: any) => {
            console.error("Ran into an issue retrieving rooms:", err);
            setError("Could not load available rooms, sorry bro");
            setLoading(false);
        });
    }, []);

    /**
     * Application submission handler.
     * @param e submission event.
     */
    const appSubmission = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        if (!selectedRoomId) {
            setError("Select Room");
            return;
        }
        const opendate = new Date(openDate);
        const closedate = new Date(closeDate);
        try {
            await (api.reservation as any).createReservationApplication.mutate({
                roomID: selectedRoomId,
                openDate: opendate,
                closeDate: closedate
            });
            setSuccess(true);
            setTimeout(() => {
                nav("/reservations");
            }, 2000);
        } catch (err: any) {
            console.error("Failed to create application:", err);
            setError(err.message || "Failed to create application");
        }
    };

    return (
        <div className="max-w-[1240px] mx-auto px-2 py-4">
            <div className="bg-white rounded-md p-4 mb-6">
                <h2 className="text-xl mb-4 text-black">Room Application</h2>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="big-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        Application Submitted
                    </div>
                )}
                {loading ? (
                    <div className="text-center py-4">
                        Finding Available Rooms..
                    </div>
                ) : (
                    <form onSubmit={appSubmission}>
                        <div className="mb-4">
                            <label htmlFor="roomSelect" className="block text-sm font-medium text-black mb-1">
                                Select Room
                            </label>
                            <select
                                id="roomSelect"
                                className="rounded-md bg-white border border-gray-300 px-2 py-1 w-full text-black"
                                value={selectedRoomId}
                                onChange={(e) => setSelectedRoomId(e.target.value)}
                                required
                            >
                                <option value="">Select Room</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name} - {room.location}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="openDateInput" className="block text-sm font-medium text-black mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="openDateInput"
                                className="rounded-md bg-white border border-gray-300 px-2 py-1 w-full text-black"
                                value={openDate}
                                onChange={(e) => setOpenDate(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
                            disabled={success}
                        >
                            Submit Application
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ReservationApplication;