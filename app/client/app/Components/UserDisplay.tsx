import React from "react";

const UserDisplay: React.FC<{
    id: string,
    firstName: string,
    lastName: string
}> = ({ id, firstName, lastName }) => (
    <div className={'break-inside-avoid rounded-md bg-white'}>


        <div className="p-4 block space-x-4 flex justify-between items-center preview-button">
            <p className="text-xl font-bold">
                {id}
            </p>
            <p className="text-lg">
                {firstName}
            </p>
            <p className="text-lg">
                {lastName}
            </p>
        </div>
    </div>
)

export default UserDisplay;
