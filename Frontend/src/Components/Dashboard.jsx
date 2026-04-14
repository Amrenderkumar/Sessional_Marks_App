import React from 'react'

const Dashboard = () => {
  return (
    <div>
      <div className='flex '>
        <div className='bg-red-300'>
          <span>📘</span>
          <h1>BRCMportal</h1>
        </div>
        <div>
          <div className='rounded-full'>
            <h1>A</h1>
          </div>
          <div className='bg-blue-400'>
            <h3 className='font-semibold text-2xl'>Name</h3>
            <p>Student,Teacher</p>
          </div>
        </div>
        <div className='bg-sky-400'>
          <h2>Dashboard</h2>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
