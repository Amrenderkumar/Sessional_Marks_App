import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Signin from './Authentication/Signin'
import Dashboard from './Components/Dashboard'
import Marks from './Components/Marks'
import axios from 'axios'
import { useEffect, useState } from "react"


const router = createBrowserRouter([
  {
    path: "/",
    element: <Signin />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/marks",
    element: <Marks />
  }
])
function App() {
  const [jokes, setJokes] = useState([])

useEffect(( ) => {
  axios.get("/jokes").then((res) => {
    setJokes(res.data);
    console.log(res.data);
  });
}, []);


  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
