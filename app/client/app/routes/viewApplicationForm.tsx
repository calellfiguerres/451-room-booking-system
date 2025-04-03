import React from "react";
import ReservationApplication from "~/Components/ReservationApplication";

export default function Application() {
    return (
        <div className="w-full pb-10 bg-black/10 height-minus-nav">
            <h1 className="text-2xl text-center py-2">Room Application</h1>
            <div className="max-w-[1240px] py-8 px-2 mx-auto space-y-4">
                <div className="rounded-md bg-white py-8 my-4">
                    <p className="text-2xl text-center tracking-widest text-black">
                        Submit an Application for a Room Reservation
                    </p>
                </div>
                <ReservationApplication />
                <div className="max-w-[1240px] mx-auto px-2 py-4">
                    <div className="big-white rounded-md p-4">
                        <h2 className="text-xl mb-4 text-black">Application Information</h2>
                        <p className="text-black mb-2">
                            Need-to-Know:
                        </p>
                        <ul className="list-disc pl-5 text-black">
                            <li className="mb-1">You will receive an email if you're application has been accepted.</li>
                            <li className="mb-1">Application status and reservation information can be found on the "My Reservations" page.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};