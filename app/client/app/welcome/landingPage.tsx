import Box from "~/Components/Box";
import NotificationBox from "~/Components/NotificationBox";
import LoginSignupBox from '~/Components/LoginSignupBox';

export function LandingPage() {

  const loginPath = "/login";
  const signupPath = "/signup";

  return (
    <div className='w-full pb-10 bg-black/10 height-minus-nav relative'>

      <div className="absolute top-5 right-5 flex items-center space-x-3 z-10">

        <LoginSignupBox loginLink={loginPath} />

        <NotificationBox link="/notifications" text="notifications" image="/public/bell.png" />

      </div>

      <div className='max-w-[1240px] py-8 px-2 mx-auto space-y-4'>

        <div className='max-w-[1240px] py-8 px-16 mx-auto pt-16'>
          <div className='grid sm:grid-cols-1 lg:grid-cols-1 gap-8 my-4'>
            <Box link="/usersList" text="View users" />
            <Box link="/reservations" text="Room Reservations" />
          </div>
        </div>
      </div>
    </div>
  );
}