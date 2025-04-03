import React from "react";
import { Link } from "react-router-dom"


const NotificationBox: React.FC<{ link: string; text: string; image: string }> = ({ link, text, image }) => {
    return (
        <Link to={link}>
            <div className="
                px-4 py-4 bg-gray-300 rounded-xl 
                hover:bg-gradient-to-r from-[#02ced9] to-[#00a7b0]
                ease-in duration-150 hover:scale-[1.01]
                border border-[#d8d8d8] hover:border-[#d8d8d800] box
            ">
                <div className="m-auto">
                    <img src={image} alt="Notification" className="w-16 h-16 mx-auto" />
                    {/* <p className="text-lg text-center tracking-widest">{text}</p> */}
                </div>
            </div>
        </Link>
    )
}

export default NotificationBox;