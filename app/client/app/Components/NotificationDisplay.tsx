import React from "react";

const NotificationDisplay: React.FC<{
    id: string,
    studentID: string,
    studentName: string,
    text: string
}> = ({ id, studentID, studentName, text }) => (
    <div className={'break-inside-avoid rounded-md bg-white'}>


        <div className="p-4 block space-x-4 flex justify-between items-center preview-button">
            <p className="text-xl font-bold">
                {id}
            </p>
            <p className="text-lg">
                {studentID}
            </p>
            <p className="text-lg">
                {studentName}
            </p>
            <p className="text-lg">
                {text}
            </p>
        </div>
    </div>
)

export default NotificationDisplay;
