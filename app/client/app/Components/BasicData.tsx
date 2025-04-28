import React from "react";

const BasicData: React.FC<{    
    name: string,
    amount: number
}> = ({ name, amount}) => (
    <div className={'break-inside-avoid rounded-md bg-white'}>


        <div className="p-4 block space-x-4 flex justify-between items-center preview-button">            
            <p className="text-lg">
                {name}
            </p>
            <p className="text-lg">
                {amount}
            </p>                       
        </div>
    </div>
)

export default BasicData;