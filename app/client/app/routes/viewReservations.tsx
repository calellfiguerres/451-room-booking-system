import { useEffect, useState } from "react";
import { api } from "~/.client/Providers/trpc";
import ReservationDisplay from "~/Components/ReservationDisplay";
import Box from "~/Components/Box";
import HomeBox from "~/Components/HomeBox";

interface Reservation {
    reservationID: number;
    studentID: string;
    roomID: string;
    roomName: string;
    location?: string;
    roomLocation?: string;
    openDate: Date;
    closeDate: Date;
    isActive: boolean;
}

export default function ViewReservations() {
    const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
    const [reservationHistory, setReservationHistory] = useState<Reservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getReservationData = async () => {
            setIsLoading(true);
            try {
                const current = await api.reservation.getCurrentReservation.query();
                const history = await api.reservation.getReservationHistory.query();
                setCurrentReservation(current);
                setReservationHistory(history);
                setError("");
            } catch (err) {
                console.error("Failed to retrieve reservation data: ", err);
                setError("Ran into an error loading reservation data. Pleas try again.");
            } finally {
                setIsLoading(false);
            }
        };
        getReservationData();
    }, []);
    return (
        <div className="w-full pb-10 bg-black/10 height-minus-nav">            
            <div className="absolute top-5 right-5 flex items-center space-x-3 z-10">             
                        <HomeBox homeLink="/" />
                    </div>
            <div className="max-w-[1240px] py-8 px-4 mx-auto space-y-6">
                <div className="rounded-md bg-white py-6 px-8">
                    <h1 className="text-2xl text-center font-semibold tracking-widest mb-2">
                        Reservations
                    </h1>
                    {isLoading ? (
                        <p className="text-center py-4">Loading reservation data.</p>
                    ) : error ? (
                        <p className="text-center text-red-500 py-4">{error}</p>
                    ) : (
                        <>
                            <div className="mt-8 mb-10">
                                <h2 className="text-xl font-medium mb-4 border-b pb-2">Current Reservation</h2>
                                {currentReservation ? (
                                    <ReservationDisplay
                                        reservationID={currentReservation.reservationID}
                                        roomName={currentReservation.roomName}
                                        roomLocation={currentReservation.roomLocation || currentReservation.location || ''}
                                        openDate={currentReservation.openDate}
                                        closeDate={currentReservation.closeDate}
                                        isActive={currentReservation.isActive}
                                    />
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-md">
                                        <p className="text-gray-500">Reservation Not Found</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-xl font-medium mb-4 border-p pb-2">Reservation History</h2>
                                {reservationHistory.length === 0 ? (
                                    <p className="text-center py-4 text-gray-500">No Reservations Found</p>
                                ) : (
                                    <div className="space-y-4">
                                        {reservationHistory.map((reservation) => (
                                            <ReservationDisplay
                                                key={reservation.reservationID}
                                                reservationID={reservation.reservationID}
                                                roomName={reservation.roomName}
                                                roomLocation={reservation.roomLocation || reservation.location || ''}
                                                openDate={reservation.openDate}
                                                closeDate={reservation.closeDate}
                                                isActive={reservation.isActive}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}