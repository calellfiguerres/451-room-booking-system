import React from "react";
import { Link } from "react-router-dom"


const Box: React.FC<{ link: string; text: string }> = ({ link, text }) => {
    return (
        <Link to={link}>
            <div className="
                px-4 py-8 bg-black/10 rounded-xl 
                hover:bg-gradient-to-r from-[#A60F2D] to-[#CA1237]
                ease-in duration-150 hover:scale-[1.01]
                border border-[#d8d8d8] hover:border-[#d8d8d800] box
            ">
                <div className="m-auto">
                    <p className="text-2xl text-center tracking-widest">{text}</p>
                </div>
            </div>
        </Link>
    )
}

export default Box;