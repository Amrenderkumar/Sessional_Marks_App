import React from 'react'
import Usercard from '../../All component/Usercard'

const Dashboard = () => {
  return (
    <div>
      <div>
        <h1 className='font-bold text-4xl'>Student Portal</h1>
        <h2 className='text-slate-500 '>Welcome Back <span>arjun</span> Here's your academic overview:</h2>
      </div>
      <div className='mt-7'>
        <Usercard />
      </div>
    </div>
  )
}

export default Dashboard
