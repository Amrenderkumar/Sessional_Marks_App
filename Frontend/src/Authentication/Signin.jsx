import React from 'react'

const Signin = () => {
    return (
        <div className="flex gap-[2%] flex-wrap content-start bg-amber-300">
            <div className=" bg-blue-600 w-full h-[50%]">Header</div>
            <div className="w-1/4 h-80 bg-red-400">Sidebar</div>
            <div className="grow h-80 bg-green-400">Content</div>
            <div className="w-full h-[50%] bg-gray-400">Footer</div>
        </div>
    )
}

export default Signin
