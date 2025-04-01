import { useEffect, useState } from "react";
import { api } from "~/.client/Providers/trpc";
import MaintenanceRequestDisplay from "~/Components/MaintenanceRequestDisplay";
import { useNavigate } from "react-router";
import type { MaintenanceRequest } from "../../../server/src/Models/MaintenanceRequest";

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
