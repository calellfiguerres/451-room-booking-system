
import { useEffect, useState } from "react";
import { api } from "~/.client/Providers/trpc";
import Box from "~/Components/Box";
import NotificationDisplay from "~/Components/NotificationDisplay";
import UserDisplay from "~/Components/UserDisplay";

interface Notification {
    id: string;
    studentID: string;
    studentName: string;
    text: string;
}

export default function notificationsList() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
  useEffect(() => {
    api.reservation.getNotifications.query().then((res) => {
        const newNotification = res.map((n) => ({
            id: n.notificationID,
            studentID: n.studentID,
            studentName: n.studentName,
            text: n.text
    }));

        setNotifications(newNotification)
    });
}, []);

  return (
    <div className='w-full pb-10 bg-black/10 height-minus-nav'>
        <div className='max-w-[1240px] py-8 px-2 mx-auto space-y-4'>
            <div className="rounded-md bg-white py-8 my-4">
                <p className='text-2xl text-center tracking-widest'>
                    NOTIFICATIONS
                </p>
            </div>

            <div className='max-w-[1240px] py-8 px-16 mx-auto '>
                <div className="mx-auto my-4 columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4 ">
                    {notifications.map(n => (
                        <NotificationDisplay
                            id={n.id}
                            studentID={n.studentID}
                            studentName={n.studentName}
                            text={n.text}                        
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}