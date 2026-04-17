import React from 'react'
import Card from '../dashboard/Card'
import Suboverview from './Suboverview'

const Usercard = () => {
    return (
        <div className='flex flex-row'>
            <Card />
            <Suboverview />
        </div>
    )
}

export default Usercard
