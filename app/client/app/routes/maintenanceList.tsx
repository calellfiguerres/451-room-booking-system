import { useEffect, useState } from "react";
import { api } from "~/.client/Providers/trpc";
import MaintenanceRequestDisplay from "~/Components/MaintenanceRequestDisplay";
import { useNavigate } from "react-router";
import type { MaintenanceRequest } from "../../../server/src/Models/MaintenanceRequest";
import HomeBox from "~/Components/HomeBox";

function getStudentId(session: any): string | null {
    console.log("Session structure:", session);

    if (!session) return null;

    try {
        if (typeof session === 'object') {
            // check if this is a StudentSession
            if ('studentid' in session && typeof session.studentid === 'string') {
                return session.studentid;
            }
            
            // it's not a student session if it has adminid
            if ('adminid' in session) {
                return null;
            }
        }
    } catch (e: any) {
        console.error("Error extracting student ID from session:", e);
    }

    return null;
}

export default function maintenanceList() {
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const navigate = useNavigate();

    // form state for creating a new maintenance request
    const [inDescription, setDescription] = useState("");
    const [inRoomId, setRoomId] = useState("");
    const [rooms, setRooms] = useState<any[]>([]);
    const [studentId, setStudentId] = useState("");
    const [error, setError] = useState("");

    // submit new maintenance request
    async function submitNewRequest() {
        if (!inDescription || !inRoomId) {
            setError("Please fill out all required fields");
            return;
        }

        if (!studentId) {
            setError("User is not logged in, or not a student");
            return;
        }

        try {
            await (api.maintenance as any).createMaintenanceRequest.mutate({
                studentId: studentId,
                roomId: inRoomId,
                description: inDescription,
            });

            // reset form
            setDescription("");
            
            // refresh page to show new request
            navigate(0);
        } catch (err: any) {
            console.error("Error creating maintenance request:", err);
            setError("Failed to create maintenance request");
        }
    }

    // fetch data on component mount
    useEffect(() => {
        // get current user's session
        (api.auth as any).getSession.query().then((session: any) => {
            // use our type guard to safely extract student ID
            const currentStudentId = getStudentId(session);
            
            if (currentStudentId) {
                setStudentId(currentStudentId);
                
                // get student's maintenance requests
                (api.maintenance as any).getStudentMaintenanceRequests.query({
                    studentId: currentStudentId
                }).then((res: any) => {
                    setRequests(res);
                }).catch((err: any) => {
                    console.error("Error fetching maintenance requests:", err);
                    setError("Failed to fetch maintenance requests");
                });
                
                // get student's rooms for the dropdown
                (api.maintenance as any).getStudentRooms.query({
                    studentId: currentStudentId
                }).then((res: any) => {
                    setRooms(res);
                    if (res.length === 1) {
                        setRoomId(res[0].id);
                    }
                }).catch((err: any) => {
                    console.error("Error fetching rooms:", err);
                    setError("Failed to fetch rooms");
                });
            } else {
                setError("You must be logged in as a student to view maintenance requests");
                console.log("Session exists but not identified as student:", session);
            }
        }).catch((err: any) => {
            console.error("Error fetching session:", err);
            setError("Failed to authenticate. Please log in again.");
        });
    }, []);

    return (
        <div className="w-full pb-10 bg-black/10 height-minus-nav">
            
            <div className="absolute top-5 right-5 flex items-center space-x-3 z-10">             
                        <HomeBox homeLink="/" />
                    </div>
            <h1 className="text-2xl text-center py-2">Maintenance Requests</h1>
            
            {/* Error message */}
            {error && (
                <div className="max-w-[1240px] mx-auto px-2 py-2">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                </div>
            )}

            {/* New request form */}
            <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); submitNewRequest(); }} className="max-w-[1240px] mx-auto px-2 py-4">
                <div className="bg-white rounded-md p-4 mb-6">
                    <h2 className="text-xl mb-4 text-black">Submit New Request</h2>
                    
                    <label htmlFor="roomIdInput" className="text-xl px-5 text-black">Room</label>
                    <select
                        id="roomIdInput"
                        name="roomId"
                        className="rounded-md bg-white border-1 px-2 text-black"
                        value={inRoomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        required
                    >
                        <option value="">-- Select Room --</option>
                        {rooms.map(room => (
                            <option key={room.id} value={room.id}>
                                {room.name} - {room.location}
                            </option>
                        ))}
                    </select>
                    <br className="py-5" />

                    <label htmlFor="descriptionInput" className="text-xl px-5 text-black">Description</label>
                    <textarea
                        id="descriptionInput"
                        name="description"
                        className="rounded-md bg-white border-1 px-2 w-full text-black"
                        rows={3}
                        value={inDescription}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please describe the maintenance issue"
                        required
                    />
                    <br className="py-5" />

                    <button type="submit" className="rounded-md bg-white mx-2 px-2 hover:border-2 text-black">Submit Request</button>
                </div>
            </form>

            <div className="max-w-[1240px] py-8 px-2 mx-auto space-y-4">
                <div className="rounded-md bg-white py-8 my-4">
                    <p className="text-2xl text-center tracking-widest text-black">
                        My Maintenance Requests
                    </p>
                </div>

                <div className="max-w-[1240px] py-8 px-16 mx-auto">
                    <p>Requests</p>
                    {requests.length === 0 ? (
                        <p className="text-center py-4">No maintenance requests found.</p>
                    ) : (
                        <div className="mx-auto my-4 columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4">
                            {requests.map(request => (
                                <MaintenanceRequestDisplay
                                    key={request.id}
                                    id={request.id}
                                    roomId={request.roomId}
                                    description={request.description}
                                    openDate={request.openDate.toString()}
                                    closeDate={request.closeDate ? request.closeDate.toString() : null}
                                    status={request.status}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
