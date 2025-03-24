
import { useEffect, useState } from "react";
import { api } from "~/.client/Providers/trpc";
import Box from "~/Components/Box";
import RoomDisplay from "~/Components/RoomDisplay";
import type { Room } from "../../../server/src/Models/Room";
import { useNavigate } from "react-router";

export default function roomlist() {
    const [rooms, setRooms] = useState<Room[]>([]);

    const navigate = useNavigate();

    const [ inName, setName ] = useState("");
    const [ inDescription, setDescription ] = useState("");
    const [ inLocation, setLocation ] = useState("");

    async function submitNewRoom() {
        
        await api.auth.newRoom.mutate({
            name: inName,
            description: inDescription,
            location: inLocation,
        });

        navigate(0);

    }
  
  useEffect(() => {
    api.admin.getRooms.query().then((res) => setRooms(res));
  }, []);

  return (

    

    <div className='w-full pb-10 bg-black/10 height-minus-nav'>
    
    
        <h1 className="text-2xl text-center py-2">Rooms</h1>
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); submitNewRoom(); }}>
            <label htmlFor="nameInput" className="text-xl px-5">Name</label>
            <input type="text" name="name" id="nameInput" className="rounded-md bg-white border-1 px-2" value={inName} onChange={(e) => setName(e.target.value)} />
            <br className="py-5" />

            <label htmlFor="descriptionInput" className="text-xl px-5">Description</label>
            <input type="text" name="description" id="descriptionInput" className="rounded-md bg-white border-1 px-2" value={inDescription} onChange={(e) => setDescription(e.target.value)} />
            <br className="py-5" />

            <label htmlFor="locationInput" className="text-xl px-5">Location</label>
            <input type="text" name="location" id="locationInput" className="rounded-md bg-white border-1 px-2" value={inLocation} onChange={(e) => setLocation(e.target.value)} />
            <br className="py-5" />
            
            <button type="submit" className="rounded-md bg-white mx-2 px-2 hover:border-2">Add Room</button>
        </form>


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