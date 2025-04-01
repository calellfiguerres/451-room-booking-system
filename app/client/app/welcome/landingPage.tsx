
import Box from "~/Components/Box";
import NotificationBox from "~/Components/NotificationBox";

export function LandingPage() {


  return (
    <div className='w-full pb-10 bg-black/10 height-minus-nav'>
        <div className='max-w-[1240px] py-8 px-2 mx-auto space-y-4'>
                <div className="float-right absolute top-10 right-10 px-2 rounded-lg text-center">
                    <NotificationBox link="/usersList" text="notifications" image="/public/bell.png"/>
                </div>
            <div className='max-w-[1240px] py-8 px-16 mx-auto'>
                <div className='grid sm:grid-cols-1 lg:grid-cols-1 gap-8 my-4'>
                    <Box link="/usersList" text="View users"/>
                    <Box link="/reservations" text="Room Reservations"/>
                </div>
            </div>
        </div>
    </div>
  );
}

