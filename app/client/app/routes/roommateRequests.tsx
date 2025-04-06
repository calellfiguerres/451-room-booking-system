import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "~/.client/Providers/trpc";

interface Roommate {
    firstname: string;
    lastname: string;
    id: string;
}

interface RoommateRequest {
    requestid: string;
    requesterId: string;
    requesteeId: string;
    message: string;
    sendDate: string;
    requestee?: Roommate,
    requester?: Roommate
}

export default function roommateRequests() {
    const [ roommateRequests, setRoommateRequests ] = useState<RoommateRequest[]>([]);
    const [ potentialRoommates, setPotentialRoommates ] = useState<Roommate[]>([]);
    const [ requestedRoommateId, setRequestedRoommateId ] = useState("none");
    const [ requestMessage, setRequestMessage ] = useState("");
    
    useEffect(() => {
        api.roommateRequest.getRoommateRequests.query().then((res) => {
            console.log(res);
            setRoommateRequests(res);
        });
        api.roommateRequest.getPotentialRoommates.query().then((res) => {
            setPotentialRoommates(res);
        });
    }, []);

    async function submitRequest() {
        if (requestedRoommateId === "none") {
            return;
        }
        await api.roommateRequest.addRoommateRequest.mutate({
            message: requestMessage,
            requesteeId: requestedRoommateId,
            senddate: new Date()
        });
        window.location.reload();
    }

    return (
        <div className='w-full pb-10 bg-black/10 height-minus-nav'>
            <div className='max-w-[1240px] py-8 px-2 mx-auto space-y-4'>
                <div className="rounded-md bg-white py-8 my-4">
                    <p className='text-2xl text-center tracking-widest'>
                        Roommate Requests
                    </p>
                </div>
            </div>
            <ul className="px-5 list-disc">
                {
                    roommateRequests.map((r) => (
                        <li key={r.requestid}>
                            <p>To: {r.requestee?.firstname} {r.requestee?.lastname}</p>
                            <p>From: {r.requester?.firstname} {r.requester?.lastname}</p>
                            <p>Message: {r.message}</p>
                            <p>Sent: {r.sendDate}</p>
                        </li>
                    ))
                }
            </ul>
            <hr />
            <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); submitRequest(); }}>
                <label htmlFor="roommateSelect" className="text-xl px-5">Select Roommate</label>
                <select name="roommateId" id="roommateSelect" value={requestedRoommateId} onChange={(e) => setRequestedRoommateId(e.target.value)}>
                    <option value="none">No Roommate Selected</option>
                    {
                        potentialRoommates.map((r) => (
                            <option key={r.id} value={r.id}>{r.firstname} {r.lastname}</option>
                        ))
                    }
                </select>
                <br />
                <label htmlFor="message" className="text-xl px-5">Message</label>
                <textarea name="message" className="w-lg bg-white rounded-md" value={requestMessage} onChange={(e) => setRequestMessage(e.target.value)}></textarea>
                <br />
                <button type="submit" className="rounded-md bg-white mx-2 px-2 hover:border-2">Submit Roommate Request</button>
            </form>
        </div>
    );
}