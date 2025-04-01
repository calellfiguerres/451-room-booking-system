
import Box from "~/Components/Box";

export function LandingPage() {


  return (
    <div className='w-full pb-10 bg-black/10 height-minus-nav'>
        <div className='max-w-[1240px] py-8 px-2 mx-auto space-y-4'>
            <div className='max-w-[1240px] py-8 px-16 mx-auto '>
                <div className='grid sm:grid-cols-1 lg:grid-cols-1 gap-8 my-4'>
                    <Box link="/login" text="Login" />
                    <Box link="/logout" text="Logout" />
                    <Box link="/signup" text="Signup" />
                    <Box link="/usersList" text="View users"/>
                    <Box link="/reservations" text="Room Reservations"/>
                    <Box link="/maintenanceList" text="Maintenance List" />
                </div>
            </div>
        </div>
    </div>
  );
}

