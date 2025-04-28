import { useEffect, useState } from "react";
import Box from "~/Components/Box";
import NotificationBox from "~/Components/NotificationBox";
import LoginSignupBox from '~/Components/LoginSignupBox';
import LogoutBox from '~/Components/LogoutBox';
import { api } from "~/.client/Providers/trpc";

export function LandingPage() {
 
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        api.auth.checkAuth.query(undefined,{}).then((res) =>{
            setIsLoggedIn(res);
        });
    },[])
   
  const loginPath = "/login";
  const logoutPath = "/logout"; 
  const notificationsPath = "/notifications";
  const usersListPath = "/usersList";
  const reservationsPath = "/reservations";
  const signupPath = "/signup";
  const maintenancePath = "/maintenanceList";
  const roomPath = "/roomList";
  const roommateRequestsPath = "/roommateRequests";
  const dataPath = "/data";

  return (
    <div className='w-full pb-10 bg-black/10 height-minus-nav relative'>

      {}
      <div className="absolute top-5 right-5 flex items-center space-x-3 z-10">
       
        {}
        {isLoggedIn ? (
          <>
            <LogoutBox LogoutLink={logoutPath} />
            <NotificationBox link={notificationsPath} text="notifications" image="/public/bell.png" />
          </>
        ) : (
          <LoginSignupBox loginLink={loginPath} signupLink={signupPath} />
        )}        
      </div>

      <div className='max-w-[1240px] py-8 px-2 mx-auto space-y-4'>
        <div className='max-w-[1240px] py-8 px-16 mx-auto pt-16'>
          <div className='grid sm:grid-cols-1 lg:grid-cols-1 gap-8 my-4'>
            <Box link={usersListPath} text="View users" />
            <Box link={roomPath} text="Rooms" />
            <Box link={reservationsPath} text="Room Reservations" />
            <Box link={maintenancePath} text="Maintenance Form" />     
            <Box link={roommateRequestsPath} text="Roommate Requests" />
            <Box link={dataPath} text="Data" />   
          </div>
        </div>
      </div>
    </div>
  );
}