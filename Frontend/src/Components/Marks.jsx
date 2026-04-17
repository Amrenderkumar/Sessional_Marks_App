import React from 'react'

const Marks = () => {

  const StudentData = [
    {
      name: 'John Doe',
      subjects: [
        { name: 'Math', marks: 85 },
        { name: 'Science', marks: 90 },
        { name: 'English', marks: 88 }
      ]
    },
    {
      name: 'Jane Smith',
      subjects: [
        { name: 'Math', marks: 92 },
        { name: 'Science', marks: 89 },
        { name: 'English', marks: 94 }
      ]
    },
    {
      name: 'Alice Johnson',
      subjects: [
        { name: 'Math', marks: 78 },
        { name: 'Science', marks: 82 },
        { name: 'English', marks: 80 }
      ]
    }
  ]

  return (
    <div>
      <div className='bg-red-300 text-2xl'>
        <h1>Marks</h1>
      </div>
      <div>
        <div className='bg-green-300'>
          <h2>Student Name</h2>
        </div>
        {StudentData.map((student, index) => {
          return (
            <div key={index} className='bg-blue-300'>
              <h3>{student.name}</h3>
              <div>
                {student.subjects.map((subject, subIndex) => (
                  <div key={subIndex} className='bg-purple-300'>
                    <h4>{subject.name}</h4>
                    <p>{subject.marks}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Marks
