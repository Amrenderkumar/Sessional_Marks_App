import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Signin from './Authentication/Signin'
import Dashboard from './Components/Dashboard'
import Marks from './Components/Marks'



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
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
