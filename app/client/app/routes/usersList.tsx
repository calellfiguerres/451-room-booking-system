
import { useEffect, useState } from "react";
import { api } from "~/.client/Providers/trpc";
import Box from "~/Components/Box";
import UserDisplay from "~/Components/UserDisplay";
import HomeBox from "~/Components/HomeBox";

interface User {
    id: string;
    firstname: string;
    lastname: string;
}

export default function usersList() {
    const [students, setStudents] = useState<User[]>([]);
    const [admins, setAdmins] = useState<User[]>([]);
    
  useEffect(() => {
    api.admin.getAdmins.query().then((res) => setAdmins(res));
    api.admin.getStudents.query().then((res) => setStudents(res));
  }, []);

  return (
    <div className='w-full pb-10 bg-black/10 height-minus-nav'>
        <div className="absolute top-5 right-5 flex items-center space-x-3 z-10">             
            <HomeBox homeLink="/" />
        </div>
        <div className='max-w-[1240px] py-8 px-2 mx-auto space-y-4'>


            <div className="rounded-md bg-white py-8 my-4">
                <p className='text-2xl text-center tracking-widest'>
                    USERS List
                </p>
            </div>

            <div className='max-w-[1240px] py-8 px-16 mx-auto '>
                <p>Admin</p>
                <div className="mx-auto my-4 columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4 ">
                    {admins.map(a => (
                        <UserDisplay
                            id={a.id}
                            firstName={a.firstname}
                            lastName={a.lastname}
                        />
                    ))}
                </div>
            </div>

            <div className='max-w-[1240px] py-8 px-16 mx-auto '>
                <p>Students</p>
                <div className="mx-auto my-4 columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4 ">
                    {students.map(s => (
                        <UserDisplay
                            id={s.id}
                            firstName={s.firstname}
                            lastName={s.lastname}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
}