
import { useEffect, useState } from "react";
import { api } from "~/.client/Providers/trpc";
import Box from "~/Components/Box";
import RoomDisplay from "~/Components/RoomDisplay";
import type { Room } from "../../../server/src/Models/Room";

interface User {
    id: string;
    firstname: string;
    lastname: string;
}

export default function roomlist() {
    const [students, setStudents] = useState<User[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    
  useEffect(() => {
    api.admin.getRooms.query().then((res) => setRooms(res));
  }, []);

  return (
    <div className='w-full pb-10 bg-black/10 height-minus-nav'>
        <div className='max-w-[1240px] py-8 px-2 mx-auto space-y-4'>
            <div className="rounded-md bg-white py-8 my-4">
                <p className='text-2xl text-center tracking-widest'>
                    Room List
                </p>
            </div>

            <div className='max-w-[1240px] py-8 px-16 mx-auto '>
                <p>Rooms</p>
                <div className="mx-auto my-4 columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4 ">
                    {rooms.map(a => (
                        <RoomDisplay
                            id={a.id}
                            name={a.name}
                            description={a.description}
                            location={a.location}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}