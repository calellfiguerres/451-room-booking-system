
import { useEffect, useState } from "react";
import { api } from "~/.client/Providers/trpc";
import Box from "~/Components/Box";
import UserDisplay from "~/Components/UserDisplay";

interface User {
    id: string;
    firstname: string;
    lastname: string;
}

export default function notificationsList() {
    const [notifications, setNotifications] = useState<User[]>([]);
    
  useEffect(() => {
    api.admin.getAdmins.query().then((res) => setNotifications(res));
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
                    {notifications.map(a => (
                        <UserDisplay
                            id={a.id}
                            firstName={a.firstname}
                            lastName={a.lastname}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}