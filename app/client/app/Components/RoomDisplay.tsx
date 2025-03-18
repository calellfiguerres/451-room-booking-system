import React from "react";

const RoomDisplay: React.FC<{    
    name: string,
    description: string,
    location: string
}> = ({ name, description, location }) => (
    <div className={'break-inside-avoid rounded-md bg-white'}>


        <div className="p-4 block space-x-4 flex justify-between items-center preview-button">            
            <p className="text-lg">
                {name}
            </p>
            <p className="text-lg">
                {description}
            </p>
            <p className="text-lg">
                {location}
            </p>            
        </div>
    </div>
)

export default RoomDisplay;
